import { Container } from "@/components/Container";
import { TextInput } from "@/components/forms/TextInput";
import { Textarea } from "@/components/forms/Textarea";
import { MAX_PROFILE_LENGTH } from "@/constants";
import { requireAuth } from "@/server/auth.server";
import { getUserWithId, updateUser } from "@/server/database.server";
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useEffect } from "react";
import { Form, data } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/profile";

const schema = z.object({
	displayName: z
		.string({ required_error: "名前は必須です" })
		.max(50, "名前は50文字まで"),
	profile: z.string().max(140, "自己紹介文は140文字まで").optional(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const auth = await requireAuth(request);
	const { displayName, profile } = await getUserWithId(auth.uid);
	return {
		user: { displayName, profile },
	};
};

export const action = async ({ params, request }: Route.ActionArgs) => {
	const user = await requireAuth(request);
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });
	try {
		if (submission.status !== "success") {
			return {
				success: false,
				submission: submission.reply(),
			};
		}

		const { displayName, profile } = submission.value;
		const result = await updateUser(user.uid, {
			displayName,
			profile,
		});
		return {
			success: !!result.writeTime,
			submission: null,
		};
	} catch (error) {
		console.error(error);
		return data(
			{ success: false, message: String(error), submission: null },
			{ status: 401 },
		);
	}
};

export default function Page({ loaderData, actionData }: Route.ComponentProps) {
	const { user } = loaderData;
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	const { displayName, profile } = user;

	useEffect(() => {
		if (!actionData) return;
		if ("success" in actionData && actionData.success) {
			location.reload();
		}
	}, [actionData]);

	return (
		<main className="py-12">
			<Container>
				<section>
					<h1>プロフィール編集</h1>
					<div className="max-w-2xl mx-auto">
						<Form
							method="post"
							// encType="multipart/form-data"
							className="flex flex-col gap-8"
							{...getFormProps(form)}
							noValidate
						>
							<label className="form-control">
								<div className="label">
									<span className="label-text">表示名</span>
									<span className="label-text-alt">hoge</span>
								</div>
								<TextInput
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="none"
									isError={!fields.displayName.valid}
									defaultValue={displayName}
									{...getInputProps(fields.displayName, { type: "text" })}
								/>
								<div className="label">
									<span className="label-text-alt text-sm" />
									<span className="label-text-alt text-error">
										{fields.displayName.errors}
									</span>
								</div>
							</label>
							<label className="form-control">
								<div className="label">
									<span className="label-text">自己紹介</span>
									<span className="label-text-alt">
										{MAX_PROFILE_LENGTH}文字まで
									</span>
								</div>
								<Textarea
									defaultValue={profile ?? ""}
									isError={!fields.profile.valid}
									{...getTextareaProps(fields.profile)}
								/>
								<div className="label">
									<span className="label-text-alt" />
									<span className="label-text-alt text-error">
										{fields.profile.errors}
									</span>
								</div>
							</label>
							<button type="submit" className="btn btn-primary">
								更新
							</button>
						</Form>
					</div>
				</section>
			</Container>
		</main>
	);
}

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
import clsx from "clsx";
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
					<Form
						method="post"
						// encType="multipart/form-data"
						{...getFormProps(form)}
						noValidate
					>
						<fieldset className="fieldset max-w-xl mx-auto flex flex-col gap-8">
							<label className="flex flex-col gap-2">
								<legend className="fieldset-legend text-base">表示名</legend>
								<TextInput
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="none"
									isError={!fields.displayName.valid}
									defaultValue={displayName}
									{...getInputProps(fields.displayName, { type: "text" })}
									className={clsx(
										"w-full",
										fields.displayName.valid && "validator",
									)}
								/>
								<div className="validator-hint text-error">
									{fields.displayName.errors}
								</div>
							</label>

							<label className="flex flex-col gap-2">
								<legend className="fieldset-legend text-base">自己紹介</legend>
								<div className="fieldset-label flex justify-between">
									{MAX_PROFILE_LENGTH}文字まで
								</div>
								<Textarea
									defaultValue={profile ?? ""}
									isError={!fields.profile.valid}
									{...getTextareaProps(fields.profile)}
									className={clsx(
										"w-full",
										fields.profile.valid && "validator",
									)}
								/>
								<div className="validator-hint text-error">
									{fields.profile.errors}
								</div>
							</label>
							<button type="submit" className="btn btn-primary">
								更新
							</button>
						</fieldset>
					</Form>
				</section>
			</Container>
		</main>
	);
}

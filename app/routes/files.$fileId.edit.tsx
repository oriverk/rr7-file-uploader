import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import clsx from "clsx";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { z } from "zod";

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { MAX_FILE_DESCRIPTION_LENGTH } from "@/constant";
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { requireAdmin, requireAuth } from "../server/auth.server";
import { getUserFile, updateUserFile } from "../server/firestore.server";

const schema = z
	.object({
		fileDescription: z
			.string()
			.max(
				MAX_FILE_DESCRIPTION_LENGTH,
				`file description must be less than ${MAX_FILE_DESCRIPTION_LENGTH}`,
			),
		isPublished: z.boolean().default(false),
	})
	.required();

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.fileId, "params.fileId is required");
	const user = await requireAuth(request);

	// for demo
	const admin = requireAdmin(user.email ?? "");
	const userid = !admin.isAdmin ? admin.adminId : user.uid;

	const file = await getUserFile(userid, params.fileId);
	invariant(file, "file not found");
	const { fileName, fileDescription, isPublished } = file;

	// for demo
	const filename = !admin.isAdmin ? "demo.zip" : fileName;
	const desc = !admin.isAdmin ? "file description for demo" : fileDescription;

	return typedjson({
		file: {
			fileName: filename,
			fileDescription: desc,
			isPublished,
		},
	});
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
	invariant(params.fileId, "params.fileId is required");
	const user = await requireAuth(request);
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	try {
		if (submission.status !== "success") {
			return json({
				success: false,
				message: null,
				submission: submission.reply(),
			});
		}
		const admin = requireAdmin(user.email ?? "");
		if (!admin.isAdmin) {
			return json({
				success: false,
				message: "This is demo app. You can't edit file.",
				submission: null,
			});
		}

		const { fileDescription, isPublished } = submission.value;
		const writeResult = await updateUserFile(user.uid, params.fileId, {
			fileDescription,
			isPublished,
		});

		if (!writeResult.writeTime) {
			throw new Error("failed to save file data");
		}
		if (writeResult.id) {
			return redirect(`/files/${writeResult.id}/edit`);
		}
	} catch (error) {
		console.error(error);
		return json(
			{
				success: false,
				message: String(error),
				submission: null,
			},
			{ status: 401 },
		);
	}
};

export default function Index() {
	const { file } = useTypedLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	const { fileName, fileDescription, isPublished } = file;

	return (
		<article className="py-12">
			<Container>
				<section>
					<h1>{fileName}</h1>
					<h2 className="text-center">ファイル編集</h2>
					<div className="max-w-2xl mx-auto flex flex-col gap-8">
						{actionData?.message && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message}
							</Alert>
						)}
						<Form
							method="post"
							className="flex flex-col gap-8"
							{...getFormProps(form)}
							noValidate
						>
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">公開する</span>
									<input
										defaultChecked={isPublished}
										className="toggle toggle-primary"
										{...getInputProps(fields.isPublished, { type: "checkbox" })}
									/>
								</label>
								<div>{fields.isPublished.errors}</div>
							</div>
							<label className="form-control">
								<div className="label">
									<span className="label-text">説明文</span>
									<span className="label-text-alt">
										{MAX_FILE_DESCRIPTION_LENGTH}文字まで
									</span>
								</div>
								<textarea
									placeholder="ファイル説明文（markdown記法使用可能）"
									className={clsx(
										"textarea textarea-bordered text-base",
										!fields.fileDescription.valid && "textarea-error",
									)}
									// @ts-ignore
									style={{ fieldSizing: "content" }}
									defaultValue={fileDescription ?? ""}
									{...getTextareaProps(fields.fileDescription)}
								/>
								<div className="label">
									<span className="label-text-alt" />
									<span className="label-text-alt text-error">
										{fields.fileDescription.errors}
									</span>
								</div>
							</label>
							<button type="submit" className="btn btn-block btn-primary">
								保存する
							</button>
						</Form>
						<Link to="/dashboard" className="btn btn-secondary btn-block mt-8">
							ダッシュボードへ戻る
						</Link>
					</div>
				</section>
			</Container>
		</article>
	);
}

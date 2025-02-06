import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { FileInput } from "@/components/forms/FileInput";
import { Textarea } from "@/components/forms/Textarea";
import {
	ALLOWED_CONTENT_TYPES,
	ALLOWED_FILE_EXTENSIONS,
	MAX_FILE_DESCRIPTION_LENGTH,
	MAX_FILE_SIZE,
} from "@/constants";
import { requireAdmin, requireAuth } from "@/server/auth.server";
import { addUserFile } from "@/server/database.server";
import { uploadToStorageHandler } from "@/server/storage.server";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import clsx from "clsx";
import { Form, Link, data, redirect } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/createFile";

const schema = z
	.object({
		fileDescription: z
			.string()
			.max(
				MAX_FILE_DESCRIPTION_LENGTH,
				`ファイル説明文は${MAX_FILE_DESCRIPTION_LENGTH}文字まで`,
			),
		file: z
			.instanceof(File)
			.refine(
				(file) => file.size < MAX_FILE_SIZE,
				`1ファイル${convertByteWithUnit(MAX_FILE_SIZE)}まで`,
			)
			.refine(
				(file) => {
					return ALLOWED_CONTENT_TYPES.includes(file.type);
				},
				`ファイル拡張子は ${ALLOWED_FILE_EXTENSIONS.join(" か ")} のみ`,
			),
		isPublished: z.boolean().default(false),
	})
	.required();

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	await requireAuth(request);
	return {
		success: true,
	};
};

export const action = async ({ request }: Route.ActionArgs) => {
	const user = await requireAuth(request);
	const formData = await request.clone().formData();
	const submission = parseWithZod(formData, { schema });
	if (submission.status !== "success") {
		return {
			success: false,
			message: null,
			submission: submission.reply(),
		};
	}

	// for demo
	const admin = requireAdmin(user.email ?? "");
	if (!admin.isAdmin) {
		return {
			success: false,
			message: "This is demo app. You can't upload file.",
			submission: null,
		};
	}
	const { fileDescription, file, isPublished } = submission.value;
	const { name, type: contentType, size } = file;

	try {
		const form = await parseFormData(
			request,
			uploadToStorageHandler("file", "files"),
			{
				maxFileSize: MAX_FILE_SIZE,
			},
		);
		const formFile = form.get("file");
		if (!(formFile instanceof File)) {
			throw new Error("failed to upload file");
		}

		const writeResult = await addUserFile(user.uid, {
			fileName: name,
			fileDescription,
			filePath: formFile.name,
			size,
			contentType,
			isPublished,
		});

		if (!writeResult.writeTime) {
			throw new Error("failed to save file data");
		}
		return redirect(`/files/${writeResult.id}/edit`) as never;
	} catch (error) {
		console.error("File upload failed:", error);
		return data(
			{ success: false, message: String(error), submission: null },
			{ status: 500 },
		);
	}
};

export default function Page({ actionData }: Route.ComponentProps) {
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<main className="py-12">
			<Container>
				<section>
					<h1>アップロード</h1>
					<div className="flex flex-col gap-8">
						{actionData?.message && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message}
							</Alert>
						)}
						<Form
							method="post"
							encType="multipart/form-data"
							{...getFormProps(form)}
							noValidate
						>
							<fieldset className="fieldset max-w-xl mx-auto flex flex-col gap-8">
								<label className="flex flex-col gap-2">
									<legend className="fieldset-legend text-base">
										ファイルを選択
									</legend>
									<div className="fieldset-label flex justify-between">
										<span>
											{ALLOWED_FILE_EXTENSIONS.map((extension, index) => (
												<code
													className="text-sm"
													key={extension}
												>{`.${extension}${ALLOWED_FILE_EXTENSIONS.length - 1 !== index ? ", " : ""}`}</code>
											))}
										</span>
										<span>{convertByteWithUnit(MAX_FILE_SIZE)}まで</span>
									</div>
									<FileInput
										{...getInputProps(fields.file, { type: "file" })}
										isError={!fields.file.valid}
										className={clsx("w-full", fields.file.valid && "validator")}
									/>
									<div className="validator-hint text-error">
										{fields.file.errors}
									</div>
								</label>

								<label>
									<div className="flex gap-8 items-center">
										<legend className="fieldset-legend text-base">
											公開する
										</legend>
										<input
											className={clsx(
												"toggle toggle-primary",
												fields.isPublished.valid && "validator",
											)}
											{...getInputProps(fields.isPublished, {
												type: "checkbox",
											})}
										/>
									</div>
									<div className="validator-hint text-error">
										{fields.isPublished.errors}
									</div>
								</label>

								<label className="flex flex-col gap-2">
									<legend className="fieldset-legend text-base">説明</legend>
									<div className="fieldset-label">
										{MAX_FILE_DESCRIPTION_LENGTH}文字まで
									</div>
									<Textarea
										placeholder="ファイル説明文（markdown記法使用可能）"
										isError={!fields.fileDescription.valid}
										{...getTextareaProps(fields.fileDescription)}
										className={clsx(
											"w-full",
											fields.fileDescription.valid && "validator",
										)}
									/>
									<div className="validator-hint text-error">
										{fields.fileDescription.errors}
									</div>
								</label>

								<button type="submit" className="btn btn-block btn-primary">
									アップロード
								</button>
							</fieldset>
						</Form>
						<Link
							to="/dashboard"
							className="link text-base text-center no-underline link-hover"
						>
							ファイルの管理へ戻る
						</Link>
					</div>
				</section>
			</Container>
		</main>
	);
}

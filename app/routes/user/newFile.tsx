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
import { Form, Link, data, redirect } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/newFile";

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

export default function Index({ actionData }: Route.ComponentProps) {
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
					<div className="max-w-2xl mx-auto flex flex-col gap-8">
						{actionData?.message && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message}
							</Alert>
						)}
						<Form
							method="post"
							encType="multipart/form-data"
							className="flex flex-col gap-8"
							{...getFormProps(form)}
							noValidate
						>
							<label className="form-control">
								<div className="label">
									<span className="label-text">ファイルを選択</span>
									<span className="label-text-alt">
										{convertByteWithUnit(MAX_FILE_SIZE)}まで
									</span>
								</div>
								<FileInput
									{...getInputProps(fields.file, { type: "file" })}
									isError={!fields.file.valid}
								/>
								<div className="label">
									<span className="label-text-alt">
										{ALLOWED_FILE_EXTENSIONS.map((extension, index) => (
											<code
												className="text-sm"
												key={extension}
											>{`.${extension}${ALLOWED_FILE_EXTENSIONS.length - 1 !== index ? ", " : ""}`}</code>
										))}
									</span>
									<span className="label-text-alt text-error">
										{fields.file.errors}
									</span>
								</div>
							</label>
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">公開する</span>
									<input
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
								<Textarea
									placeholder="ファイル説明文（markdown記法使用可能）"
									isError={!fields.fileDescription.valid}
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
								アップロード
							</button>
						</Form>
						<Link to="/dashboard" className="btn btn-secondary btn-block mt-8">
							ファイルの管理へ戻る
						</Link>
					</div>
				</section>
			</Container>
		</main>
	);
}

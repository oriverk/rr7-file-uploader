import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	UploadHandler,
} from "@remix-run/node";
import {
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	json,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { redirect, typedjson } from "remix-typedjson";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { FileInput } from "@/components/form/FileInput";
import { Textarea } from "@/components/form/Textarea";
import {
	ALLOWED_FILE_EXTENSIONS,
	MAX_FILE_DESCRIPTION_LENGTH,
	MAX_FILE_SIZE,
} from "@/constant";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { requireAdmin, requireAuth } from "../server/auth.server";
import { addUserFile } from "../server/firestore.server";
import { uploadToFirebaseStorage } from "../server/storage.server";

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
					const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
					return ALLOWED_FILE_EXTENSIONS.includes(fileExtension);
				},
				`ファイル拡張子は ${ALLOWED_FILE_EXTENSIONS.join(" か ")} のみ`,
			),
		isPublished: z.boolean().default(false),
	})
	.required();

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	await requireAuth(request);

	return typedjson({
		success: true,
	});
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await requireAuth(request);
	const formData = await request.clone().formData();

	try {
		const submission = parseWithZod(formData, { schema });
		if (submission.status !== "success") {
			return json({
				success: false,
				message: null,
				submission: submission.reply(),
			});
		}

		// for demo
		const admin = requireAdmin(user.email ?? "");
		if (!admin.isAdmin) {
			return json({
				success: false,
				message: "This is demo app. You can't upload file.",
				submission: null,
			});
		}

		const { fileDescription, file, isPublished } = submission.value;
		const { name, type: contentType, size } = file;
		const uuid = uuidv4();
		const fileName = `${uuid}-${name}`;

		const uploadHandler: UploadHandler = composeUploadHandlers(
			async ({ name, contentType, data, filename }) => {
				if (name !== "file" || !filename) {
					return null;
				}

				// const fileExtension = filename.split(".").pop()?.toLowerCase();
				// if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension || "")) {
				// throw new Error("Invalid file extension");
				// }

				const signedUrl = await uploadToFirebaseStorage(
					data,
					`files/${uuid}-${filename}`,
					Date.now() + 60 * 60 * 1000,
				);
				return signedUrl;
			},
			createMemoryUploadHandler(),
		);
		const form = await parseMultipartFormData(request, uploadHandler);
		const url = form.get("file");
		if (!url) {
			throw new Error("failed to upload file");
		}

		const writeResult = await addUserFile(user.uid, {
			fileName: name,
			fileDescription,
			filePath: fileName,
			size,
			contentType,
			isPublished,
		});

		if (!writeResult.writeTime) {
			throw new Error("failed to save file data");
		}
		if (writeResult.id) {
			return redirect(`/files/${writeResult.id}/edit`);
		}
	} catch (error) {
		console.error("File upload failed:", error);
		return json(
			{ success: false, message: String(error), submission: null },
			{ status: 500 },
		);
	}
};

export default function Index() {
	const actionData = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<article className="py-12">
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
		</article>
	);
}

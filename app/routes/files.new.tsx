import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	UploadHandler,
} from "@remix-run/node";
import {
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import {
	ALLOWED_FILE_EXTENSIONS,
	MAX_FILE_DESCRIPTION_LENGTH,
	MAX_FILE_SIZE,
} from "@/constant";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Form, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { redirect, typedjson, useTypedActionData } from "remix-typedjson";
import { requireAuth } from "../server/auth.server";
import { addUserFile } from "../server/firestore.server";
import { uploadToFirebaseStorage } from "../server/storage.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	await requireAuth(request);
	return typedjson({
		success: true,
	});
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await requireAuth(request);
	const formData = await request.clone().formData();
	const file = formData.get("file");
	const fileDescription = formData.get("fileDescription");
	const publish = formData.get("publish");
	const formError = typedjson(
		{
			success: false,
			message: "Please fill all fields!",
		},
		{ status: 400 },
	);

	try {
		if (typeof fileDescription !== "string") return formError;
		if (MAX_FILE_DESCRIPTION_LENGTH < fileDescription.length) {
			throw new Error(
				`Description is limited to ${MAX_FILE_DESCRIPTION_LENGTH} characters.`,
			);
		}
		if (typeof publish !== "string" && publish !== null) return formError;
		if (!(file instanceof File)) return formError;
		const { name, type: contentType, size } = file;
		if (size > MAX_FILE_SIZE) {
			throw new Error("File size exceeds the allowed limit");
		}
		const isPublished = Boolean(publish);
		const uuid = uuidv4();
		const fileName = `${uuid}-${name}`;

		const uploadHandler: UploadHandler = composeUploadHandlers(
			async ({ name, contentType, data, filename }) => {
				if (name !== "file" || !filename) {
					return null;
				}

				const fileExtension = filename.split(".").pop()?.toLowerCase();
				if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension || "")) {
					throw new Error("Invalid file extension");
				}

				const signedUrl = await uploadToFirebaseStorage(
					data,
					`images/${uuid}-${filename}`,
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
		return typedjson(
			{ success: false, message: "アップロード中にエラーが発生しました" },
			{ status: 500 },
		);
	}
};

export default function Index() {
	const actionData = useTypedActionData<typeof action>();
	const [log, setLog] = useState<{ success: boolean; message: string } | null>(
		null,
	);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLog(null);
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_FILE_SIZE) {
			return setLog({
				success: false,
				message: "The file size must be less than 1MB.",
			});
		}

		const fileExtension = file.name.split(".").pop()?.toLowerCase();
		if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension || "")) {
			return setLog({
				success: false,
				message: "Only .zip, and .png files are allowed.",
			});
		}
	};

	useEffect(() => {
		if (!actionData) return;
		const { message } = actionData as unknown as {
			message: string;
		};
		const log = actionData as unknown as {
			success: boolean;
			message: string;
		};
		setLog(log);
	}, [actionData]);

	return (
		<article>
			<Container>
				<section className="py-16">
					<h1 className="text-center">アップロード</h1>
					<div className="max-w-2xl mx-auto">
						<Form
							method="post"
							encType="multipart/form-data"
							className="flex flex-col gap-8"
						>
							<label className="form-control">
								<div className="label">
									<span className="label-text">ファイルを選択</span>
									<span className="label-text-alt">必須</span>
								</div>
								<input
									type="file"
									name="file"
									required
									accept={ALLOWED_FILE_EXTENSIONS.join(",")}
									onChange={handleFileChange}
									className="file-input file-input-bordered"
								/>
								<div className="label">
									<span className="label-text-alt">
										{ALLOWED_FILE_EXTENSIONS.map((extension, index) => (
											<>
												<code
													className="text-sm"
													key={extension}
												>{`.${extension}`}</code>
												{ALLOWED_FILE_EXTENSIONS.length - 1 !== index && ", "}
											</>
										))}
									</span>
									<span className="label-text-alt">
										{convertByteWithUnit(MAX_FILE_SIZE)}まで
									</span>
								</div>
							</label>
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">公開する</span>
									<input type="checkbox" name="publish" className="toggle" />
								</label>
							</div>
							<label className="form-control">
								<div className="label">
									<span className="label-text">説明文</span>
									<span className="label-text-alt">必須</span>
								</div>
								<textarea
									name="fileDescription"
									placeholder="Bio"
									required
									minLength={0}
									maxLength={MAX_FILE_DESCRIPTION_LENGTH}
									className="textarea textarea-bordered text-base"
									// @ts-ignore
									style={{ fieldSizing: "content" }}
								/>
								<div className="label">
									<span className="label-text-alt" />
									<span className="label-text-alt">
										{MAX_FILE_DESCRIPTION_LENGTH}文字まで
									</span>
								</div>
							</label>
							<button type="submit" className="btn btn-block btn-primary">
								アップロード
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

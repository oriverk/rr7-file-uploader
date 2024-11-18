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

import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { redirect, typedjson, useTypedActionData } from "remix-typedjson";
import { ContentSection } from "../components/ContentSection";
import { requireAuth } from "../server/auth.server";
import { addUserFile } from "../server/firestore.server";
import { uploadToFirebaseStorage } from "../server/storage.server";

const MAX_DESCRIPTION_LENGTH = 15000;
const MAX_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_EXTENSIONS = ["png", "zip"];

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
		{ error: "Please fill all fields!" },
		{ status: 400 },
	);

	try {
		if (typeof fileDescription !== "string") return formError;
		if (fileDescription.length > MAX_DESCRIPTION_LENGTH) {
			throw new Error(
				`Description is limited to ${MAX_DESCRIPTION_LENGTH} characters.`,
			);
		}
		if (typeof publish !== "string" && publish !== null) return formError;
		if (!(file instanceof File)) return formError;
		const { name, type: contentType, size } = file;
		if (size > MAX_SIZE) {
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

				if (!ALLOWED_EXTENSIONS.includes(fileExtension || "")) {
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
			{ url: null, error: "アップロード中にエラーが発生しました" },
			{ status: 500 },
		);
	}
};

export default function Index() {
	const actionData = useTypedActionData<typeof action>();
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_SIZE) {
			setError("The file size must be less than 1MB.");
			return;
		}

		const fileExtension = file.name.split(".").pop()?.toLowerCase();
		if (!ALLOWED_EXTENSIONS.includes(fileExtension || "")) {
			setError("Only .zip, and .png files are allowed.");
			return;
		}

		console.log("File is valid:", file);
	};

	return (
		<div>
			{actionData && <pre>{JSON.stringify(actionData, null, 2)}</pre>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<ContentSection>
				<Form
					method="post"
					encType="multipart/form-data"
					className="flex flex-col gap-8"
				>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">ファイルを選択</span>
							<span className="label-text-alt">必須</span>
						</div>
						<input
							type="file"
							name="file"
							required
							accept={ALLOWED_EXTENSIONS.join(",")}
							onChange={handleFileChange}
							className="file-input file-input-bordered"
						/>
						<div className="label">
							<span className="label-text-alt">
								{ALLOWED_EXTENSIONS.map((extension, index) => (
									<>
										<code
											className="text-sm"
											key={extension}
										>{`.${extension}`}</code>
										{ALLOWED_EXTENSIONS.length - 1 !== index && ", "}
									</>
								))}
							</span>
							<span className="label-text-alt">1MBまで</span>
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
							maxLength={MAX_DESCRIPTION_LENGTH}
							className="textarea textarea-bordered h-24 w-full"
						/>
						<div className="label">
							<span className="label-text-alt" />
							<span className="label-text-alt">
								{MAX_DESCRIPTION_LENGTH}文字まで
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
			</ContentSection>
		</div>
	);
}

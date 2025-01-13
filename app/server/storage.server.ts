import { ALLOWED_CONTENT_TYPES, CONTENT_TYPES } from "@/constants";
import type { FileUpload, FileUploadHandler } from "@mjackson/form-data-parser";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./firebase.server";

export async function getServerFileSignedUrl(
	filePath: string,
	expires: number,
) {
	try {
		const [signedUrl] = await storage.file(filePath).getSignedUrl({
			action: "read",
			expires,
		});
		return signedUrl;
	} catch (error) {
		console.error("Failed to generate signed URL:", error);
	}
}

/**
 *
 * @param fieldName The name of the <input> field used to upload the file.
 * @param destination storage bucket directory, files
 * @returns
 */
export function uploadToStorageHandler(
	fieldName: string,
	destination: string,
): FileUploadHandler {
	return (file) => {
		if (file.fieldName !== fieldName) return;
		if (!ALLOWED_CONTENT_TYPES.includes(file.type)) return;
		const fileName = `${uuidv4()}.${CONTENT_TYPES[file.type]}`;

		return uploadToStorage(file, destination, fileName);
	};
}

export async function uploadToStorage(
	fileUpload: FileUpload,
	destination: string,
	fileName: string,
) {
	const path = `${destination}/${fileName}`;
	const file = storage.file(path);
	const data = await fileUpload.arrayBuffer();
	const buffer = Buffer.from(data);
	try {
		await file.save(buffer);
	} catch (error) {
		console.error("File upload failed:", error);
	}

	const blob = new Blob([data]);
	return new File([blob], fileName, { type: fileUpload.type });
}

/**
 *
 * @param destination storage bucket directory, files
 * @param fileName hoge.zip
 */
export async function downloadFileFromStorage(
	destination: string,
	fileName: string,
) {
	const [buffer] = await storage.file(`${destination}/${fileName}`).download();
	return buffer;
}

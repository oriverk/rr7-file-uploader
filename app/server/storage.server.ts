import { writeAsyncIterableToWritable } from "@remix-run/node";

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
 * @param data The iterable of the file bytes
 * @param name The name of the file in this bucket. (like images/rickroll.mp4)
 * @param expires Signed URL expiration
 * @returns
 */
export async function uploadToFirebaseStorage(
	data: AsyncIterable<Uint8Array>,
	name: string,
	expires?: number,
) {
	const blob = storage.file(name);
	const writableStream = blob.createWriteStream();
	await writeAsyncIterableToWritable(data, writableStream);
	const [url] = await blob.getSignedUrl({
		action: "read",
		expires: expires ?? Date.now() + 60 * 60 * 1000,
	});
	return url;
}

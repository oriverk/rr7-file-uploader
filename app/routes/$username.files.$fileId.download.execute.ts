import type { LoaderFunctionArgs } from "@remix-run/node";
import { FieldValue } from "firebase-admin/firestore";
import invariant from "tiny-invariant";
import { firestore, storage } from "../server/firebase.server";
import { getUserFile, updateUserFile } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	try {
		invariant(params.username, "params.username is requied");
		invariant(params.fileId, "params.fileId is required");
		const userSnapshot = await firestore
			.collection("users")
			.where("uid", "==", params.username)
			.limit(1)
			.get();
		invariant(!userSnapshot.empty, "user not found");
		const userDoc = userSnapshot.docs[0];
		const userId = userDoc.id;
		const file = await getUserFile(userId, params.fileId);
		invariant(file, `File not found: ${params.fileId}`);
		const { downloadCount, updatedAt, ...rest } = file;
		await updateUserFile(userId, params.fileId, {
			downloadCount: FieldValue.increment(1) as unknown as number,
			...rest,
		});

		const [buffer] = await storage.file(`files/${file.filePath}`).download();

		return new Response(buffer, {
			headers: {
				"Content-Type": file.contentType,
				"Content-Disposition": `attachment; filename="${file.fileName}"`,
			},
		});
	} catch (error) {
		console.error("Error downloading file:", error);
		throw new Response("Failed to download file", { status: 500 });
	}
};

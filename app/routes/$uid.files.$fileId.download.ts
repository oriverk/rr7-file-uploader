import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { storage } from "../server/firebase.server";
import { getUserFile, updateUserFile } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	try {
		invariant(params.uid, "params.uid is requied");
		invariant(params.fileId, "params.fileId is required");
		const file = await getUserFile(params.uid, params.fileId);
		invariant(file, `File not found: ${params.fileId}`);
		const { downloaded, ...rest } = file;
		const count = downloaded + 1;
		await updateUserFile(params.uid, params.fileId, {
			downloaded: count,
			...rest,
		});

		const [buffer] = await storage.file(file.fullPath).download();

		return new Response(buffer, {
			headers: {
				"Content-Type": file.contentType,
				"Content-Disposition": `attachment; filename="${file.name}"`,
			},
		});
	} catch (error) {
		console.error("Error downloading file:", error);
		throw new Response("Failed to download file", { status: 500 });
	}
};

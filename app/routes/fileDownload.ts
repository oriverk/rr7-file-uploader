import { getUser, getUserFile, updateUserFile } from "@/server/database.server";
import { downloadFileFromStorage } from "@/server/storage.server";
import { FieldValue } from "firebase-admin/firestore";
import invariant from "tiny-invariant";
import type { Route } from "./+types/fileDownload";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	try {
		invariant(params.username, "params.username is requied");
		invariant(params.fileId, "params.fileId is required");
		const user = await getUser(params.username);
		invariant(user.id, "User not found.");
		const file = await getUserFile(user.id, params.fileId);
		invariant(file, `File not found: ${params.fileId}`);
		const { downloadCount, updatedAt, ...rest } = file;
		await updateUserFile(
			user.id,
			params.fileId,
			{
				downloadCount: FieldValue.increment(1) as unknown as number,
			},
			true,
		);

		const buffer = await downloadFileFromStorage("files", file.filePath);

		return new Response(buffer, {
			status: 200,
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

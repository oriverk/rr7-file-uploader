import { firestore } from "../server/firebase.server";

export async function addUserFiles(uid: string, files: any[]) {
	const userFilesCollection = firestore.collection(`users/${uid}/files`);
	const batch = firestore.batch();
	for (const file of files) {
		const newDocRef = userFilesCollection.doc(); // 新しいドキュメントを生成
		const {
			name,
			description,
			path,
			contentType,
			size,
			downloaded,
			createdAt,
			updatedAt,
		} = file;

		const data = {
			filePath: path,
			fileName: name,
			fileDescription: description,
			contentType,
			size,
			downloadCount: downloaded,
			isPublished: true,
			createdAt,
			updatedAt,
			deletedAt: null,
		};

		batch.set(newDocRef, data);
	}

	const writeResults = await batch.commit();
	console.log("シードデータを追加しました");
	return writeResults;
}

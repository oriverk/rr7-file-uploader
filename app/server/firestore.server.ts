import {
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	Timestamp,
	type WithFieldValue,
} from "firebase-admin/firestore";
import type { FirestoreFileType } from "../types/firestore";
import { formatDate } from "../utils/formatDate";
import { firestore } from "./firebase.server";

export interface IProps
	extends Omit<FirestoreFileType, "createdAt" | "updatedAt"> {
	id: string;
	createdAt: string;
	updatedAt: string;
}

const converter = () => ({
	toFirestore: (data: IProps) => {
		const { createdAt, updatedAt, ...rest } = data;
		const create =
			typeof createdAt === "string"
				? Timestamp.fromDate(new Date(createdAt))
				: createdAt;
		const update =
			typeof updatedAt === "string"
				? Timestamp.fromDate(new Date(updatedAt))
				: updatedAt;
		return {
			createdAt: create,
			updatedAt: update,
			...rest,
		};
	},
	fromFirestore: (snap: QueryDocumentSnapshot) => {
		const data = snap.data() as FirestoreFileType;
		const { createdAt, updatedAt, ...rest } = data;
		if (typeof createdAt !== "string") {
			return {
				id: snap.id,
				createdAt: formatDate(createdAt.toDate()),
				updatedAt: formatDate(updatedAt.toDate()),
				...rest,
			};
		}

		return {
			id: snap.id,
			createdAt: createdAt,
			updatedAt: updatedAt,
			...rest,
		};
	},
});

// helper to apply converter to multiple collections
const dataPoint = (collectionPath: string) => {
	// @ts-ignore
	return firestore.collection(collectionPath).withConverter(converter<T>());
};

const db = {
	userFiles: (uid: string) =>
		// @ts-ignore
		firestore
			.collection("files")
			.withConverter(converter()),
	userFile: (uid: string, fileId: string) =>
		// @ts-ignore
		firestore
			.doc(`files/${fileId}`)
			.withConverter(converter()),
};

export async function getUserFiles(uid: string) {
	const snapshot = await db.userFiles(uid).get();
	const data = snapshot.docs.map((doc) => doc.data()) as IProps[];
	return data;
}

export async function getUserFile(uid: string, fileId: string) {
	const ref = db.userFile(uid, fileId);
	const snapshot = await ref.get();
	const data = snapshot.data() as IProps;
	return data;
}

export async function updateUserFile(
	uid: string,
	fileId: string,
	data: IProps,
) {
	const ref = db.userFile(uid, fileId);
	const { createdAt, updatedAt, ...rest } = data;
	const create = Timestamp.fromDate(new Date(createdAt));
	const update = Timestamp.fromDate(new Date(updatedAt));
	await ref.update({ createdAt: create, updatedAt: update, ...rest });
}

export async function addUserFile(uid: string, data: IProps) {
	const ref = db.userFiles(uid).doc();
	const { createdAt, updatedAt, ...rest } = data;
	const create = Timestamp.fromDate(new Date(createdAt));
	const update = Timestamp.fromDate(new Date(updatedAt));
	await ref.set({ ...data });
}

export async function logicalDeleteUserFile(uid: string, fileId: string) {
	return null;
}

export async function removeUserFile(uid: string, fileId: string) {
	await db.userFiles(uid).doc(fileId).delete();
}

import type {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	WithFieldValue,
} from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import { doc, serverTimestamp } from "firebase/firestore";
import type { FirestoreFileType } from "../types/firestore";
// import { formatDate } from "../utils/formatDate";
import { firestore } from "./firebase.server";

type User = {
	uid: string;
	displayName: string;
	email: string;
	profile: string;
	profileImageUrl: string;
};

export async function addUser(userid: string, userData: User) {
	const userRef = firestore.collection("users").doc(userid);
	const createdAt = Timestamp.now();
	const updatedAt = Timestamp.now();
	await userRef.set({
		...userData,
		createdAt,
		updatedAt,
		deletedAt: null,
	});

	return {
		id: userRef.id,
		...userData,
		updatedAt,
	};
}

export async function updateUser(userid: string, userData: Partial<User>) {
	const userRef = firestore.collection("users").doc(userid);
	const updatedAt = Timestamp.now();
	await userRef.update({
		...userData,
		updatedAt,
	});

	return {
		id: userRef.id,
		...userData,
		updatedAt,
	};
}

export async function deleteUserLogically(userid: string) {
	const userRef = firestore.collection("users").doc(userid);
	const deletedAt = Timestamp.now();
	await userRef.update({
		deletedAt,
	});

	return { id: userid, deletedAt };
}

// export interface IProps
// 	extends Omit<FirestoreFileType, "createdAt" | "updatedAt"> {
// 	id: string;
// 	createdAt: string;
// 	updatedAt: string;
// }

// export interface IProps extends FirestoreFileType {
// 	id: string;
// }

export interface IProps
	extends Omit<FirestoreFileType, "createdAt" | "updatedAt" | "deletedAt"> {
	id?: string;
	createdAt: Date | Timestamp | string;
	updatedAt: Date | Timestamp | string;
	deletedAt: Date | Timestamp | string | null;
}

const getTimeStamp = (date: IProps["createdAt"]) =>
	date instanceof Date ? Timestamp.fromDate(date) : date;
const getDate = (date: IProps["createdAt"]) =>
	date instanceof Timestamp ? date.toDate().toISOString() : date;

// Timestamp型判別用の型ガード
function isTimestamp(value: any): value is Timestamp {
	return value instanceof Timestamp;
}

// Date型判別用の型ガード
function isDate(value: any): value is Date {
	return value instanceof Date;
}

export function formatDateToISOString(
	value: Date | string | Timestamp,
): string {
	if (isTimestamp(value)) {
		return value.toDate().toISOString();
	}
	if (isDate(value)) {
		return value.toISOString();
	}
	return value;
}

const fileConverter: FirestoreDataConverter<IProps> = {
	toFirestore(file: IProps): DocumentData {
		return {
			...file,
			createdAt: getTimeStamp(file.createdAt),
			updatedAt: getTimeStamp(file.createdAt),
			deletedAt: getTimeStamp(file.updatedAt),
		};
	},
	fromFirestore(snapshot: QueryDocumentSnapshot): IProps {
		const data = snapshot.data();
		return {
			...data,
			createdAt: getDate(data.createdAt),
			updatedAt: getDate(data.updatedAt),
			deletedAt: getDate(data.deletedAt),
		} as IProps;
	},
};

// helper to apply converter to multiple collections
// const dataPoint = (collectionPath: string) => {
// 	// @ts-ignore
// 	return firestore.collection(collectionPath).withConverter(converter<T>());
// };

const db = {
	user: (uid: string) => firestore.collection("users").withConverter(null),

	userFiles: (uid: string) =>
		firestore.collection(`users/${uid}/files`).withConverter(fileConverter),
	// userFiles: (uid: string) =>
	// 	firestore
	// 		.collection("users")
	// 		.doc(uid)
	// 		.collection("files")
	// 		.withConverter(fileConverter()),
	userFile: (uid: string, fileId: string) =>
		firestore
			.collection(`users/${uid}/files`)
			.doc(fileId)
			.withConverter(fileConverter),
};

export async function getUserFiles(uid: string) {
	const snapshot = await db.userFiles(uid).orderBy("createdAt", "desc").get();
	const files = snapshot.docs.map((doc) => {
		const { createdAt, updatedAt, ...rest } = doc.data();
		return {
			id: doc.id,
			createdAt: formatDateToISOString(createdAt),
			updatedAt: formatDateToISOString(updatedAt),
			...rest,
		};
	});
	// const files = snapshot.docs.map((doc) => ({
	// 	id: doc.id,
	// 	...doc.data()
	// }))
	return files;
}

export async function getUserFile(uid: string, fileId: string) {
	const ref = db.userFile(uid, fileId);
	const snapshot = await ref.get();
	const data = snapshot.data();
	if (!data) {
		throw new Error("file not found");
	}
	const { createdAt, updatedAt, ...rest } = data;
	return {
		id: snapshot.id,
		createdAt: formatDateToISOString(createdAt),
		updatedAt: formatDateToISOString(updatedAt),
		...rest,
	};
}

export async function addUserFile(
	uid: string,
	data: Omit<IProps, "createdAt" | "updatedAt" | "deletedAt">,
) {
	const filesRef = db.userFiles(uid);
	const newFileRef = filesRef.doc();

	await newFileRef.set({
		...data,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		deletedAt: null,
	});
}

export async function updateUserFile(
	uid: string,
	fileId: string,
	data: Omit<IProps, "updatedAt">,
) {
	const ref = db.userFile(uid, fileId);
	await ref.update({
		...data,
		updatedAt: Timestamp.now(),
	});
}

export async function logicalDeleteUserFile(uid: string, fileId: string) {
	const ref = db.userFile(uid, fileId);
	await ref.update({
		deletedAt: serverTimestamp(),
	});
}

export async function removeUserFile(uid: string, fileId: string) {
	await db.userFiles(uid).doc(fileId).delete();
}

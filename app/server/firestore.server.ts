import type {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	WithFieldValue,
} from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import type { FirestoreFileType } from "../types/firestore";
// import { formatDate } from "../utils/formatDate";
import { firestore } from "./firebase.server";

type User = {
	// Firestore ドキュメントのID
	id?: string;
	uid: string;
	displayName: string;
	email: string;
	profile: string;
	profileImageUrl: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	deletedAt: Timestamp | null;
};

export async function getUser(userId: string) {
	const ref = db.users();
	const query = ref.where("uid", "==", userId).limit(1);
	const querySnapshot = await query.get();

	const user = querySnapshot.docs.map((doc) => {
		const id = doc.id;
		const user = doc.data();
		return {
			id,
			...user,
		};
	})[0];
	return user;
}

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

export interface IProps
	extends Omit<FirestoreFileType, "createdAt" | "updatedAt" | "deletedAt"> {
	id?: string;
	createdAt: Date | Timestamp | string;
	updatedAt: Date | Timestamp | string;
	deletedAt: Date | Timestamp | string | null;
}

export type FirestoreFile = {
	fileName: string;
	fileDescription: string;
	filePath: string;
	size: number;
	contentType: string;
	isPublished: boolean;
	downloadCount: number;
	// password: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	deletedAt: Timestamp | null;
};

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

const userConverter: FirestoreDataConverter<User> = {
	toFirestore(user: User): DocumentData {
		const { id, ...restProps } = user;
		return {
			...restProps,
		};
	},
	fromFirestore(snapshot: QueryDocumentSnapshot): User {
		const data = snapshot.data();
		return {
			id: snapshot.id,
			uid: data.uid,
			displayName: data.displayName,
			email: data.email,
			profile: data.profile,
			profileImageUrl: data.profileImageUrl,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			deletedAt: data.deletedAt,
		};
	},
};

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

const db = {
	user: (uid: string) =>
		firestore.collection("users").where("uid", "==", uid).limit(1),
	users: () => firestore.collection("users").withConverter(userConverter),
	userFiles: (uid: string) =>
		firestore
			.collection("users")
			.doc(uid)
			.collection("files")
			.withConverter(fileConverter),
	userFile: (uid: string, fileId: string) =>
		firestore
			.collection("users")
			.doc(uid)
			.collection("files")
			.doc(fileId)
			.withConverter(fileConverter),
};

export async function getUserFiles(uid: string, isPublished: boolean) {
	const collectionRef = db.userFiles(uid);
	const commonQuery = collectionRef.where("deletedAt", "==", null);
	const query = isPublished
		? commonQuery.where("isPublished", "==", true)
		: commonQuery;
	const querySnapshot = await query.orderBy("createdAt", "desc").get();
	const files = querySnapshot.docs.map((doc) => {
		const { createdAt, updatedAt, ...rest } = doc.data();
		return {
			id: doc.id,
			createdAt: formatDateToISOString(createdAt),
			updatedAt: formatDateToISOString(updatedAt),
			...rest,
		};
	});
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
	data: Omit<IProps, "downloadCount" | "createdAt" | "updatedAt" | "deletedAt">,
) {
	const filesRef = db.userFiles(uid);
	const newFileRef = filesRef.doc();

	const { writeTime } = await newFileRef.set({
		...data,
		downloadCount: 0,
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
		deletedAt: null,
	});
	return {
		id: newFileRef.id,
		path: newFileRef.path,
		writeTime,
	};
}

export async function updateUserFile(
	uid: string,
	fileId: string,
	data: Partial<Omit<IProps, "updatedAt">>,
) {
	const ref = db.userFile(uid, fileId);
	const { id, path } = ref;
	const { writeTime } = await ref.update({
		...data,
		updatedAt: Timestamp.now(),
	});
	return {
		id,
		path,
		writeTime,
	};
}

export async function softDeleteUserFile(uid: string, fileId: string) {
	const ref = db.userFile(uid, fileId);
	const { id, path } = ref;
	const { writeTime } = await ref.update({
		updatedAt: Timestamp.now(),
		deletedAt: Timestamp.now(),
	});
	return {
		id,
		path,
		writeTime,
	};
}

// export async function removeUserFile(uid: string, fileId: string) {
// 	await db.userFiles(uid).doc(fileId).delete();
// }

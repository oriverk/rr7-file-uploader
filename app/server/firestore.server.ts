import type {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import type { FirestoreFile, User } from "../types/firestore";
import { firestore } from "./firebase.server";

const userConverter: FirestoreDataConverter<User> = {
	toFirestore(user: User): DocumentData {
		const { id, createdAt, updatedAt, deletedAt, ...restProps } = user;
		return {
			...restProps,
			createdAt: Timestamp.fromDate(createdAt),
			updatedAt: Timestamp.fromDate(updatedAt),
			deletedAt: deletedAt ? Timestamp.fromDate(deletedAt) : null,
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
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
			deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
		};
	},
};

const fileConverter: FirestoreDataConverter<FirestoreFile> = {
	toFirestore(file: FirestoreFile): DocumentData {
		const { id, createdAt, updatedAt, deletedAt, ...restProps } = file;
		return {
			...restProps,
			createdAt: Timestamp.fromDate(createdAt),
			updatedAt: Timestamp.fromDate(updatedAt),
			deletedAt: deletedAt ? Timestamp.fromDate(deletedAt) : null,
		};
	},
	fromFirestore(snapshot: QueryDocumentSnapshot): FirestoreFile {
		const data = snapshot.data();

		return {
			id: snapshot.id,
			fileName: data.fileName,
			fileDescription: data.fileDescription,
			filePath: data.filePath,
			size: data.size,
			contentType: data.contentType,
			isPublished: data.isPublished,
			downloadCount: data.downloadCount,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
			deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
		};
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

export async function getUser(userId: string) {
	const collectionRef = db.users();
	const query = collectionRef.where("uid", "==", userId).limit(1);
	const querySnapshot = await query.get();

	const user = querySnapshot.docs.map((doc) => {
		return doc.data();
	})[0];
	return user;
}

export async function addUser(
	userid: string,
	data: Omit<User, "createdAt" | "updatedAt" | "deletedAt">,
) {
	const { id, ...restProps } = data;
	const docRef = firestore.collection("users").doc(userid);
	const createdAt = Timestamp.now();
	const updatedAt = Timestamp.now();
	await docRef.set({
		...restProps,
		createdAt,
		updatedAt,
		deletedAt: null,
	});

	return {
		id: docRef.id,
		...data,
		updatedAt,
	};
}

export async function updateUser(userid: string, data: Partial<User>) {
	const { id, ...restProps } = data;
	const docRef = firestore.collection("users").doc(userid);
	const updatedAt = Timestamp.now();
	await docRef.update({
		...restProps,
		updatedAt,
	});

	return {
		id: docRef.id,
		...data,
		updatedAt,
	};
}

export async function softDeleteUser(userid: string) {
	const docRef = firestore.collection("users").doc(userid);
	const deletedAt = Timestamp.now();
	await docRef.update({
		deletedAt,
	});

	return { id: userid, deletedAt };
}

export async function getUserFiles(uid: string, isPublished: boolean) {
	const collectionRef = db.userFiles(uid);
	const commonQuery = collectionRef.where("deletedAt", "==", null);
	const query = isPublished
		? commonQuery.where("isPublished", "==", true)
		: commonQuery;
	const querySnapshot = await query.orderBy("createdAt", "desc").get();
	const files = querySnapshot.docs.map((doc) => {
		return doc.data();
	});
	return files;
}

export async function getUserFile(uid: string, fileId: string) {
	const docRef = db.userFile(uid, fileId);
	const snapshot = await docRef.get();
	const data = snapshot.data();
	if (!data || data.deletedAt) {
		throw new Error("file not found");
	}

	return data;
}

export async function addUserFile(
	uid: string,
	data: Omit<
		FirestoreFile,
		"downloadCount" | "createdAt" | "updatedAt" | "deletedAt"
	>,
) {
	const collectionRef = db.userFiles(uid);
	const newCollectionRef = collectionRef.doc();

	const { writeTime } = await newCollectionRef.set({
		...data,
		downloadCount: 0,
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
		deletedAt: null,
	});
	return {
		id: newCollectionRef.id,
		path: newCollectionRef.path,
		writeTime,
	};
}

export async function updateUserFile(
	uid: string,
	fileId: string,
	data: Partial<Omit<FirestoreFile, "updatedAt">>,
) {
	const { id, ...restProps } = data;
	const docRef = db.userFile(uid, fileId);
	const { writeTime } = await docRef.update({
		...restProps,
		updatedAt: Timestamp.now(),
	});
	return {
		id,
		path: docRef.path,
		writeTime,
	};
}

export async function softDeleteUserFile(uid: string, fileId: string) {
	const docRef = db.userFile(uid, fileId);
	const { id, path } = docRef;
	const { writeTime } = await docRef.update({
		updatedAt: Timestamp.now(),
		deletedAt: Timestamp.now(),
	});
	return {
		id,
		path,
		writeTime,
	};
}

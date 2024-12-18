import { RESERVED_WORDS } from "@/constants";
import type {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import type { FirestoreFile, User } from "../types";
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
			username: data.username,
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
		firestore.collection("users").doc(uid).withConverter(userConverter),
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

export async function getUserWithId(id: string) {
	const docRef = db.user(id);
	const docSnapshot = await docRef.get();
	const user = docSnapshot.data();

	if (!user || user.deletedAt !== null) {
		throw new Error("User not found.");
	}
	return user;
}

export async function checkExistingUser(username: User["username"]) {
	if (RESERVED_WORDS.includes(username)) return true;

	const collectionRef = db.users();
	const query = collectionRef.where("username", "==", username).limit(1);
	const querySnapshot = await query.get();
	if (querySnapshot.empty) {
		console.log("No users found in the collection.");
		return false;
	}
	const user = querySnapshot.docs.map((doc) => {
		return doc.data();
	})[0];
	if (!user || user.deletedAt) {
		console.log("No users found in the collection.");
		return false;
	}
	return true;
}

export async function getUser(username: User["username"]) {
	const collectionRef = db.users();
	const query = collectionRef.where("username", "==", username).limit(1);
	const querySnapshot = await query.get();
	if (querySnapshot.empty) {
		throw new Error("No users found in the collection.");
	}

	const user = querySnapshot.docs.map((doc) => {
		return doc.data();
	})[0];
	if (!user || user.deletedAt) {
		throw new Error("User not found.hhh");
	}
	return user;
}

export async function addUser(
	uid: string,
	data: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">,
) {
	const docRef = firestore.collection("users").doc(uid);
	const createdAt = Timestamp.now().toDate();
	const updatedAt = Timestamp.now().toDate();
	const { writeTime } = await docRef.set({
		...data,
		createdAt,
		updatedAt,
		deletedAt: null,
	});

	if (!writeTime) {
		throw new Error("Failed to create user.");
	}
	const { id, path } = docRef;

	return {
		id,
		path,
		writeTime: writeTime.toDate(),
	};
}

export async function updateUser(
	uid: string,
	data: Partial<Omit<User, "createdAt" | "updatedAt" | "deletedAt">>,
) {
	const { id: _id, ...restProps } = data;
	const docRef = firestore.collection("users").doc(uid);
	const updatedAt = Timestamp.now().toDate();
	const { writeTime } = await docRef.update({
		...restProps,
		updatedAt,
	});
	if (!writeTime) {
		throw new Error("Failed to update user.");
	}
	const { id, path } = docRef;

	return {
		id,
		path,
		writeTime: writeTime.toDate(),
	};
}

export async function softDeleteUser(uid: string) {
	const docRef = firestore.collection("users").doc(uid);
	const deletedAt = Timestamp.now().toDate();
	const { writeTime } = await docRef.update({
		deletedAt,
	});
	if (!writeTime) {
		throw new Error("Failed to delete user.");
	}

	const { id, path } = docRef;

	return {
		id,
		path,
		writeTime: writeTime.toDate(),
	};
}

export async function getUserFiles(uid: string, isPublished: boolean) {
	const collectionRef = db.userFiles(uid);
	const commonQuery = collectionRef.where("deletedAt", "==", null);
	const query = isPublished
		? commonQuery.where("isPublished", "==", true)
		: commonQuery;
	const querySnapshot = await query.orderBy("createdAt", "desc").get();
	if (querySnapshot.empty) {
		return [];
	}
	const files = querySnapshot.docs.map((doc) => {
		return doc.data();
	});
	return files;
}

export async function getUserFile(uid: string, fileId: string) {
	const docRef = db.userFile(uid, fileId);
	const snapshot = await docRef.get();
	const file = snapshot.data();
	if (!file || file.deletedAt) {
		throw new Error("file not found.");
	}

	return file;
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
		createdAt: Timestamp.now().toDate(),
		updatedAt: Timestamp.now().toDate(),
		deletedAt: null,
	});
	if (!writeTime) {
		throw new Error("Failed to create file.");
	}
	const { id, path } = newCollectionRef;
	return {
		id,
		path,
		writeTime: writeTime.toDate(),
	};
}

export async function updateUserFile(
	uid: string,
	fileId: string,
	data: Partial<Omit<FirestoreFile, "updatedAt">>,
	isDownload?: boolean,
) {
	const { id: _id, ...restProps } = data;
	const docRef = db.userFile(uid, fileId);
	const newData = {
		...restProps,
	};
	if (!isDownload) {
		// @ts-ignore
		newData.updatedAt = Timestamp.now().toDate();
	}
	const { writeTime } = await docRef.update(newData);
	if (!writeTime) {
		throw new Error("Failed to update file.");
	}
	const { id, path } = docRef;
	return {
		id,
		path,
		writeTime: writeTime.toDate(),
	};
}

export async function softDeleteUserFile(uid: string, fileId: string) {
	const docRef = db.userFile(uid, fileId);
	const { writeTime } = await docRef.update({
		updatedAt: Timestamp.now().toDate(),
		deletedAt: Timestamp.now().toDate(),
	});
	if (!writeTime) {
		throw new Error("Failed to delete file.");
	}
	const { id, path } = docRef;
	return {
		id,
		path,
		writeTime: writeTime.toDate(),
	};
}

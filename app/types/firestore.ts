export type User = {
	// Firestore ドキュメントのID
	id?: string;
	uid: string;
	displayName: string;
	email: string;
	profile: string;
	profileImageUrl: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};

export type FirestoreFile = {
	// Firestore ドキュメントのID
	id?: string;
	fileName: string;
	fileDescription: string;
	filePath: string;
	size: number;
	contentType: string;
	isPublished: boolean;
	downloadCount: number;
	// password: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};

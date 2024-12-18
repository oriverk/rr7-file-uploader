export type User = {
	// Firestore ドキュメントのID
	id?: string;
	// root/{username}/files/{fileId}
	username: string;
	// just name to display
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
	/**
	 * xxx.zip
	 */
	fileName: string;
	fileDescription: string;
	/**
	 * {uuid}.{contentType}
	 */
	filePath: string;
	size: number;
	/**
	 * MIME type
	 */
	contentType: string;
	isPublished: boolean;
	downloadCount: number;
	// password: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};

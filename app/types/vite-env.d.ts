/* eslint-disable no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	// firebase
	readonly FIREBASE_PROJECT_ID: string;
	readonly FIREBASE_API_KEY: string;
	readonly FIREBASE_PRIVATE_KEY: string;
	readonly FIREBASE_CLIENT_EMAIL: string;
	readonly FIREBASE_STORAGEBUCKET: string;
	readonly FIREBASE_DATABASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

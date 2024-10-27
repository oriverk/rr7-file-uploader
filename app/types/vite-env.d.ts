/* eslint-disable no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SITE_PATH: string;
	readonly VITE_IXANARY_PATH: string;
	readonly VITE_PUBLISHER_ID: string;
	readonly VITE_GA4_TRACKING_ID: string;
	readonly VITE_AMAZON_WISHLIST: string;
	// cloudinary
	readonly VITE_CLOUDINARY_NAME: string;
	// admin
	readonly VITE_VALID_EMAIL_ADRESS: string;
	// firebase
	readonly VITE_FIREBASE_APP_KEY: string;
	readonly VITE_FIREBASE_AUTH_DOMAIN: string;
	readonly VITE_FIREBASE_DATABASE_URL: string;
	readonly VITE_FIREBASE_PROJECT_ID: string;
	readonly VITE_FIREBASE_STORAGEBUCKET: string;
	readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
	readonly VITE_FIREBASE_APP_ID: string;
	readonly VITE_FIREBASE_MEASUREMENT_ID: string;

	readonly VITE_FIREBASE_AUTH_PERSISIT: boolean;

	readonly FIREBASE_PROJECT_ID: string;
	readonly FIREBASE_CLIENT_EMAIL: string;
	readonly FIREBASE_PRIVATE_KEY: string;
	readonly FIREBASE_DATABASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
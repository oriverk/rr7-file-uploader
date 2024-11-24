import {
	type AppOptions,
	getApps as getServerApps,
	initializeApp as initializeServerApp,
	cert as serverCert,
} from "firebase-admin/app";
import { getAuth, getAuth as getServerAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

import { getFirestore } from "firebase-admin/firestore";
import * as firebaseRest from "../firebase-rest";

// Warning: though getRestConfig is only run server side, its return value may be sent to the client
export const getRestConfig = (): {
	apiKey: string;
	domain: string;
} => {
	if (process.env.NODE_ENV === "development" && !process.env.API_KEY) {
		return {
			apiKey: "fake-api-key",
			domain: "http://localhost:9099/identitytoolkit.googleapis.com",
		};
	}
	if (!process.env.API_KEY) {
		throw new Error("Missing API_KEY environment variable");
	}
	return {
		apiKey: process.env.API_KEY,
		domain: "https://identitytoolkit.googleapis.com",
	};
};
const restConfig = getRestConfig();

if (getServerApps().length === 0) {
	let config: AppOptions;
	try {
		const serviceAccount = {
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
		};

		config = {
			credential: serverCert(serviceAccount),
			storageBucket: process.env.VITE_FIREBASE_STORAGEBUCKET,
		};
	} catch {
		throw Error("Invalid SERVICE_ACCOUNT environment variable");
	}

	initializeServerApp(config);
}

const signInWithPassword = async (email: string, password: string) => {
	const signInResponse = await firebaseRest.signInWithPassword(
		{
			email,
			password,
			returnSecureToken: true,
		},
		restConfig,
	);

	if (firebaseRest.isError(signInResponse)) {
		throw new Error(signInResponse.error.message);
	}

	return signInResponse;
};

export const auth = {
	server: getServerAuth(),
	signInWithPassword,
};

export const storage = getStorage().bucket();
export const firestore = getFirestore();

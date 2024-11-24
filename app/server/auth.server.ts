import type { Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { UserRecord } from "firebase-admin/auth";

import type { User } from "@/types";
import { destroySession, getSession } from "../sesions";
import { auth } from "./firebase.server";
import { addUser } from "./firestore.server";

export const checkSessionCookie = async (session: Session) => {
	try {
		const decodedIdToken = await auth.server.verifySessionCookie(
			session.get("session") || "",
		);
		return decodedIdToken;
	} catch {
		return { uid: undefined };
	}
};

export const requireAuth = async (request: Request): Promise<UserRecord> => {
	const session = await getSession(request.headers.get("cookie"));
	const { uid } = await checkSessionCookie(session);
	if (!uid) {
		throw redirect("/login", {
			headers: { "Set-Cookie": await destroySession(session) },
		});
	}
	const user = auth.server.getUser(uid);
	return user;
};

export const signIn = async (email: string, password: string) => {
	const { idToken } = await auth.signInWithPassword(email, password);
	const sessionCookie = signInWithToken(idToken);
	return sessionCookie;
};

export const signInWithToken = async (idToken: string) => {
	const expiresIn = 1000 * 60 * 60 * 24 * 7; // 1 week
	const sessionCookie = await auth.server.createSessionCookie(idToken, {
		expiresIn,
	});
	return sessionCookie;
};

export const signUp = async (
	username: User["username"],
	displayName: User["displayName"],
	email: string,
	password: string,
) => {
	const user = await auth.server.createUser({
		email,
		password,
		displayName,
	});
	const { uid, photoURL } = user;
	await addUser(uid, {
		username,
		displayName,
		email,
		profile: "",
		profileImageUrl: photoURL ?? "",
	});
	return await signIn(email, password);
};

import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
	session: string;
};

type SessionFlashData = {
	error: string;
};

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: "__session",
			secrets: ["fancy-secret-key"],
			maxAge: 60 * 60 * 24 * 7, // 1 week
			sameSite: "lax",
			path: "/",
			httpOnly: true,
		},
	});

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
	Link,
	useActionData,
	useLoaderData,
	useSubmit,
} from "@remix-run/react";
import { useCallback, useState } from "react";

import { ContentSection } from "../components/ContentSection";
import * as firebaseRest from "../firebase-rest";
import {
	checkSessionCookie,
	signIn,
	signInWithToken,
} from "../server/auth.server";
import { getRestConfig } from "../server/firebase.server";
import { commitSession, getSession } from "../sesions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("cookie"));
	const { uid } = await checkSessionCookie(session);
	const headers = {
		"Set-Cookie": await commitSession(session),
	};
	if (uid) {
		return redirect("/", { headers });
	}
	const { apiKey, domain } = getRestConfig();
	return json({ apiKey, domain }, { headers });
};

type ActionData = {
	error?: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData();
	const idToken = form.get("idToken");
	let sessionCookie: string;
	try {
		if (typeof idToken === "string") {
			sessionCookie = await signInWithToken(idToken);
		} else {
			const email = form.get("email");
			const password = form.get("password");
			const formError = json(
				{ error: "Please fill all fields!" },
				{ status: 400 },
			);
			if (typeof email !== "string") return formError;
			if (typeof password !== "string") return formError;
			sessionCookie = await signIn(email, password);
		}
		const session = await getSession(request.headers.get("cookie"));
		session.set("session", sessionCookie);
		return redirect("/", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	} catch (error) {
		console.error(error);
		return json({ error: String(error) }, { status: 401 });
	}
};

export default function Login() {
	const [clientAction, setClientAction] = useState<ActionData>();
	const actionData = useActionData<typeof action>();
	const restConfig = useLoaderData<typeof loader>();
	const submit = useSubmit();

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			// To avoid rate limiting, we sign in client side if we can.
			const login = await firebaseRest.signInWithPassword(
				{
					email: event.currentTarget.email.value,
					password: event.currentTarget.password.value,
					returnSecureToken: true,
				},
				restConfig,
			);
			if (firebaseRest.isError(login)) {
				setClientAction({ error: login.error.message });
				return;
			}
			submit({ idToken: login.idToken }, { method: "post" });
		},
		[submit, restConfig],
	);
	return (
		<div>
			<h1>Login</h1>
			{clientAction?.error || actionData?.error ? (
				<p>{clientAction?.error || actionData?.error}</p>
			) : null}
			<ContentSection>
				<form
					method="post"
					onSubmit={handleSubmit}
					className="not-prose flex flex-col gap-4"
				>
					<dl>
						<dt>
							<label htmlFor="email">Email</label>
						</dt>
						<dd>
							<input
								type="email"
								name="email"
								autoComplete="email"
								placeholder="test@example.com"
								className="input input-bordered w-full"
							/>
						</dd>
						<dt>
							<label htmlFor="password">Password</label>
						</dt>
						<dd>
							<input
								type="password"
								name="password"
								placeholder="password"
								autoComplete="current-password"
								className="input input-bordered w-full"
							/>
						</dd>
					</dl>

					<button type="submit" className="btn btn-secondary">
						Login
					</button>
				</form>
				<p>
					Do you want to{" "}
					<Link to="/join" className="link">
						join
					</Link>
					?
				</p>
			</ContentSection>
		</div>
	);
}

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { ContentSection } from "../components/ContentSection";
import { checkSessionCookie, signUp } from "../server/auth.server";
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
	return json(null, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData();
	const name = form.get("name");
	const email = form.get("email");
	const password = form.get("password");
	const formError = json({ error: "Please fill all fields!" }, { status: 400 });
	if (typeof name !== "string") return formError;
	if (typeof email !== "string") return formError;
	if (typeof password !== "string") return formError;
	try {
		const sessionCookie = await signUp(name, email, password);
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
	const actionData = useActionData<typeof action>();
	return (
		<div>
			<h1>Join</h1>
			{actionData?.error ? <p>{actionData.error}</p> : null}
			<ContentSection>
				<Form method="post" className="not-prose flex flex-col gap-4">
					<dl className="flex flex-col gap-2">
						<dt>
							<label htmlFor="name">Name</label>
						</dt>
						<dd>
							<input
								type="text"
								name="name"
								placeholder="test"
								autoComplete="name"
								className="input input-bordered w-full"
							/>
						</dd>
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
								autoComplete="new-password"
								className="input input-bordered w-full"
							/>
						</dd>
					</dl>
					<button type="submit" className="btn btn-secondary">
						Join
					</button>
				</Form>
				<p>
					Do you want to{" "}
					<Link to="/login" className="link">
						login
					</Link>
					?
				</p>
			</ContentSection>
		</div>
	);
}

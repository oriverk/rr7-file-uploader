import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Container } from "@/components/Container";
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
		<article>
			<Container>
				<section>
					<h1 className="text-center">Join</h1>
					{actionData?.error ? <p>{actionData.error}</p> : null}
					<div className="mx-auto w-96">
						<Form method="post" className="flex flex-col gap-8">
							<label className="form-control">
								<div className="label">
									<span className="label-text">Display Name</span>
									<span className="label-text-alt">hoge</span>
								</div>
								<input
									type="text"
									name="name"
									autoComplete="name"
									className="input input-bordered"
								/>
								<div className="label">
									<span className="label-text-alt">hoge</span>
									<span className="label-text-alt">hoge</span>
								</div>
							</label>
							<label className="form-control">
								<div className="label">
									<span className="label-text">Email</span>
									<span className="label-text-alt">hoge</span>
								</div>
								<input
									type="email"
									name="email"
									autoComplete="email"
									placeholder="test@example.com"
									className="input input-bordered"
								/>
								<div className="label">
									<span className="label-text-alt">hoge</span>
									<span className="label-text-alt">hoge</span>
								</div>
							</label>
							<label className="form-control">
								<div className="label">
									<span className="label-text">Password</span>
									<span className="label-text-alt">hoge</span>
								</div>
								<input
									type="password"
									name="password"
									placeholder="password"
									autoComplete="new-password"
									className="input input-bordered"
								/>
								<div className="label">
									<span className="label-text-alt">hoge</span>
									<span className="label-text-alt">hoge</span>
								</div>
							</label>
							<button type="submit" className="btn btn-primary">
								Join
							</button>
						</Form>
						<p className="text-center">
							Do you want to{" "}
							<Link to="/login" className="link">
								login
							</Link>
							?
						</p>
					</div>
				</section>
			</Container>
		</article>
	);
}

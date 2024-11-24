import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
	Link,
	useActionData,
	useLoaderData,
	useSubmit,
} from "@remix-run/react";
import { useState } from "react";

import { Container } from "@/components/Container";
import { EyeClosedIcon, EyeIcon } from "@/components/icons";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import clsx from "clsx";
import { z } from "zod";
import * as firebaseRest from "../firebase-rest";
import {
	checkSessionCookie,
	signIn,
	signInWithToken,
} from "../server/auth.server";
import { getRestConfig } from "../server/firebase.server";
import { commitSession, getSession } from "../sesions";

const schema = z.object({
	email: z
		.string({ required_error: "メールアドレスは必須です" })
		.email("無効なメールアドレスです"),
	password: z.string({ required_error: "パスワードは必須です" }),
	idToken: z.string().optional(),
});

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
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });
	let sessionCookie: string;
	try {
		if (submission.status !== "success") {
			return json(submission.reply());
		}

		const { idToken, email, password } = submission.value;
		if (typeof idToken === "string") {
			sessionCookie = await signInWithToken(idToken);
		} else {
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
	const restConfig = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const submit = useSubmit();
	const [showPassword, setShowPassword] = useState(false);
	const [form, fields] = useForm({
		// @ts-ignore
		lastResult: actionData,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		onSubmit: async (
			event,
			{ formData, action, encType, method, submission },
		) => {
			event.preventDefault();
			const email = event.currentTarget.email.value;
			const password = event.currentTarget.password.value;
			const login = await firebaseRest.signInWithPassword(
				{
					email,
					password,
					returnSecureToken: true,
				},
				restConfig,
			);
			if (firebaseRest.isError(login)) {
				setClientAction({ error: login.error.message });
				return;
			}
			submit({ idToken: login.idToken, email, password }, { method: "post" });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const { onSubmit, ...restFormSubmit } = getFormProps(form);
	return (
		<article>
			<Container>
				<section className="py-12">
					<h1 className="text-center">ログイン</h1>
					<div className="w-96 mx-auto">
						<form
							method="post"
							{...getFormProps(form)}
							className="flex flex-col gap-4"
							{...restFormSubmit}
						>
							<label className="form-control">
								<div className="label">
									<span className="label-text">Eメール</span>
									<span className="label-text-alt">hoge</span>
								</div>
								<input
									autoComplete="email"
									placeholder="test@example.com"
									className={clsx(
										"input input-bordered",
										!fields.email.valid && "input-error",
									)}
									{...getInputProps(fields.email, { type: "email" })}
								/>
								<div className="label">
									<span className="label-text-alt">hoge</span>
									<span className="label-text-alt text-error">
										{fields.email.errors}
									</span>
								</div>
							</label>
							<label className="form-control">
								<div className="label">
									<span className="label-text">パスワード</span>
									<span className="label-text-alt" />
								</div>
								<div className="input input-bordered flex items-center gap-2">
									<input
										placeholder="password"
										autoComplete="current-password"
										className="grow"
										{...getInputProps(fields.password, {
											type: showPassword ? "text" : "password",
										})}
									/>
									<button
										type="button"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? (
											<EyeIcon className="h-5 w-5 fill-current" />
										) : (
											<EyeClosedIcon className="h-5 w-5 fill-current" />
										)}
									</button>
								</div>
								<div className="label">
									<span className="label-text-alt text-sm" />
									<span className="label-text-alt text-error">
										{fields.password.errors}
									</span>
								</div>
							</label>
							<button type="submit" className="btn btn-primary">
								ログイン
							</button>
						</form>
						<p className="text-center">
							<Link to="/join" className="link">
								アカウントを作成
							</Link>{" "}
							しますか?
						</p>
					</div>
				</section>
			</Container>
		</article>
	);
}

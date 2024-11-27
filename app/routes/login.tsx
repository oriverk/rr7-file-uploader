import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
	Link,
	useActionData,
	useLoaderData,
	useSubmit,
} from "@remix-run/react";

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { EmailInput } from "@/components/form/EmailInput";
import { PasswordInput } from "@/components/form/PasswordInput";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import * as firebaseRest from "../firebase-rest";
import {
	checkSessionCookie,
	requireAdmin,
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

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });
	let sessionCookie: string;
	try {
		if (submission.status !== "success") {
			return json({
				success: false,
				message: null,
				submission: submission.reply(),
			});
		}

		const { idToken, email, password } = submission.value;

		// for demo
		const admin = requireAdmin(email);
		if (email !== "test@example.com" && !admin.isAdmin) {
			return json({
				success: false,
				message:
					"This is demo app. You can login only with test@example.com and password",
				submission: submission.reply(),
			});
		}

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
		return json(
			{
				success: false,
				message: String(error),
				submission: null,
			},
			{ status: 401 },
		);
	}
};

export default function Login() {
	const restConfig = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const submit = useSubmit();
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
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
			if (firebaseRest.isError(login)) return;
			submit({ idToken: login.idToken, email, password }, { method: "post" });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const { onSubmit, ...restFormSubmit } = getFormProps(form);
	return (
		<article className="py-12">
			<Container>
				<section>
					<h1>ログイン</h1>
					<div className="w-96 mx-auto flex flex-col gap-8">
						{actionData?.message && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message}
							</Alert>
						)}
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
								<EmailInput
									autoComplete="email"
									placeholder="test@example.com"
									isError={!fields.email.valid}
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
								<PasswordInput
									placeholder="password"
									autoComplete="current-password"
									isError={!fields.password.valid}
									{...getInputProps(fields.password, { type: "password" })}
								/>
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

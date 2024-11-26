import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Container } from "@/components/Container";
import { EyeClosedIcon, EyeIcon } from "@/components/icons";
import { checkExistingUser } from "@/server/firestore.server";
import type { Intent } from "@conform-to/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { conformZodMessage, parseWithZod } from "@conform-to/zod";
import clsx from "clsx";
import { useState } from "react";
import { z } from "zod";
import { checkSessionCookie, signUp } from "../server/auth.server";
import { commitSession, getSession } from "../sesions";

function createSchema(
	intent: Intent | null,
	options?: {
		isUsernameUnique: (username: string) => Promise<boolean>;
	},
) {
	return z
		.object({
			username: z
				.string({ required_error: "名前は必須です" })
				.min(3, "少なくとも３文字")
				.regex(/^[a-z\d-]+$/, "不正な名前: 英数字とハイフンのみ")
				.pipe(
					z.string().superRefine((username, ctx) => {
						const isValidatingUsername =
							intent === null ||
							(intent.type === "validate" &&
								intent.payload.name === "username");

						if (!isValidatingUsername) {
							ctx.addIssue({
								code: "custom",
								message: conformZodMessage.VALIDATION_SKIPPED,
							});
							return;
						}

						if (typeof options?.isUsernameUnique !== "function") {
							ctx.addIssue({
								code: "custom",
								message: conformZodMessage.VALIDATION_UNDEFINED,
								fatal: true,
							});
							return;
						}

						return options.isUsernameUnique(username).then((isUnique) => {
							if (!isUnique) {
								ctx.addIssue({
									code: "custom",
									message: "その名前は既に使われています",
								});
							}
						});
					}),
				),
		})
		.and(
			z.object({
				email: z
					.string({ required_error: "メールアドレスは必須です" })
					.email("メールアドレスの形式で入力してください"),
				password: z.string({ required_error: "パスワードは必須です" }),
			}),
		);
}

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
	const formData = await request.formData();
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			createSchema(intent, {
				isUsernameUnique: async (username) => {
					const isExisting = await checkExistingUser(username);
					return !isExisting;
				},
			}),
		async: true,
	});

	try {
		if (submission.status !== "success") {
			return json(submission.reply());
		}
		const { username, email, password } = submission.value;
		const sessionCookie = await signUp(username, username, email, password);
		const session = await getSession(request.headers.get("cookie"));
		session.set("session", sessionCookie);
		return redirect(`/${username}`, {
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
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const actionData = useActionData<typeof action>();
	const [form, fields] = useForm({
		// @ts-ignore
		lastResult: actionData,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: (intent) => createSchema(intent),
			});
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const handleInputName = (e: any) => {
		setUsername(e.target.value);
	};

	return (
		<article className="py-12">
			<Container>
				<section>
					<h1>アカウントを作成</h1>
					<div className="mx-auto w-96">
						<Form
							method="post"
							className="flex flex-col gap-8"
							{...getFormProps(form)}
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
										autoComplete="new-password"
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
							<label className="form-control">
								<div className="label">
									<span className="label-text">ハンドルネーム</span>
									<span className="label-text-alt">hoge</span>
								</div>
								<input
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="none"
									className={clsx(
										"input input-bordered",
										!fields.username.valid && "input-error",
									)}
									onInput={handleInputName}
									{...getInputProps(fields.username, { type: "text" })}
								/>
								<div className="label">
									<span className="label-text-alt text-sm">
										<code>{"/^[a-zd-]{3,}$/"}</code>
									</span>
									<span className="label-text-alt text-error">
										{fields.username.errors}
									</span>
								</div>
								<div className="label">
									{username ? (
										<span className="label-text-alt">
											ファイルURLは `{`/${username}/files/{fileId}`}`
										</span>
									) : (
										<span className="label-text-alt">&nbsp;</span>
									)}
								</div>
							</label>
							<button type="submit" className="btn btn-primary">
								登録
							</button>
						</Form>
						<p className="text-center">
							<Link to="/login" className="link">
								ログイン
							</Link>{" "}
							しますか?
						</p>
					</div>
				</section>
			</Container>
		</article>
	);
}

import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { EmailInput, PasswordInput, TextInput } from "@/components/forms";
import { checkSessionCookie, requireAdmin, signUp } from "@/server/auth.server";
import { checkExistingUser } from "@/server/database.server";
import { commitSession, getSession } from "@/server/sesions.server";
import type { Intent } from "@conform-to/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { conformZodMessage, parseWithZod } from "@conform-to/zod";
import { useState } from "react";
import { Form, Link, data, redirect } from "react-router";
import { z } from "zod";

import clsx from "clsx";
import type { Route } from "./+types/join";

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

export const loader = async ({ request }: Route.LoaderArgs) => {
	const session = await getSession(request.headers.get("cookie"));
	const { uid } = await checkSessionCookie(session);

	const headers = {
		"Set-Cookie": await commitSession(session),
	};
	if (uid) {
		return redirect("/", { headers }) as never;
	}
	return data(null, { headers });
};

export const action = async ({ request }: Route.ActionArgs) => {
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
			return {
				success: false,
				message: null,
				submission: submission.reply(),
			};
		}
		const { username, email, password } = submission.value;
		// for demo
		const admin = requireAdmin(email);
		if (!admin.isAdmin) {
			return {
				success: false,
				message:
					"This is demo app. You can't register, but you can log in with a demo account.",
				submission: submission.reply(),
			};
		}

		const sessionCookie = await signUp(username, username, email, password);
		const session = await getSession(request.headers.get("cookie"));
		session.set("session", sessionCookie);
		return redirect(`/${username}`, {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		}) as never;
	} catch (error) {
		console.error(error);
		return data(
			{
				success: false,
				message: String(error),
				submission: null,
			},
			{ status: 401 },
		);
	}
};

export default function Page({ actionData }: Route.ComponentProps) {
	const [username, setUsername] = useState("");
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
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
		<main className="py-12">
			<Container>
				<section>
					<h1>アカウントを作成</h1>
					<div className="mx-auto max-w-96 flex flex-col gap-8">
						{actionData?.message && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message}
							</Alert>
						)}
						<Form method="post" {...getFormProps(form)}>
							<fieldset className="fieldset max-w-sm flex flex-col gap-8">
								<label>
									<legend className="fieldset-legend text-base">Email</legend>
									<EmailInput
										autoComplete="email"
										placeholder="test@example.com"
										isError={!fields.email.valid}
										{...getInputProps(fields.email, {
											type: "email",
										})}
										className={clsx(
											"w-full",
											fields.email.valid && "validator",
										)}
									/>
									<div className="validator-hint text-error">
										{fields.email.errors}
									</div>
								</label>

								<label>
									<legend className="fieldset-legend text-base">
										Password
									</legend>
									<PasswordInput
										placeholder="password"
										autoComplete="new-password"
										isError={!fields.password.valid}
										{...getInputProps(fields.password, { type: "password" })}
										className={clsx(
											"w-full",
											fields.password.valid && "validator",
										)}
									/>
									<div className="validator-hint text-error">
										{fields.password.errors}
									</div>
								</label>

								<label className="flex flex-col gap-2">
									<legend className="fieldset-legend text-base">Name</legend>
									<TextInput
										autoComplete="off"
										autoCorrect="off"
										autoCapitalize="none"
										isError={!fields.username.valid}
										onInput={handleInputName}
										{...getInputProps(fields.username, { type: "text" })}
										className={clsx(
											"w-full",
											fields.username.valid && "validator",
										)}
									/>
									<div className="fieldset-label">
										<code>{"/^[a-zd-]{3,}$/"}</code>
									</div>
									<div className="fieldset-label">
										ファイルURLは `{`/${username}/files/{fileId}`}`
									</div>
									<div className="validator-hint text-error">
										{fields.username.errors}
									</div>
								</label>
								<button type="submit" className="btn btn-block btn-primary">
									登録
								</button>
							</fieldset>
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
		</main>
	);
}

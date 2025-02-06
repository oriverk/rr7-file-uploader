import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { Textarea } from "@/components/forms/Textarea";
import { FileIcon, HistoryIcon, UploadIcon } from "@/components/icons";
import { MAX_FILE_DESCRIPTION_LENGTH } from "@/constants";
import { requireAdmin, requireAuth } from "@/server/auth.server";
import { getUserFile, updateUserFile } from "@/server/database.server";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { Form, Link, data, redirect } from "react-router";
import invariant from "tiny-invariant";
import { z } from "zod";
import type { Route } from "./+types/editFile";

const schema = z
	.object({
		fileDescription: z
			.string()
			.max(
				MAX_FILE_DESCRIPTION_LENGTH,
				`file description must be less than ${MAX_FILE_DESCRIPTION_LENGTH}`,
			),
		isPublished: z.boolean().default(false),
	})
	.required();

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	invariant(params.fileId, "params.fileId is required");
	const user = await requireAuth(request);

	// for demo
	const admin = requireAdmin(user.email ?? "");
	const userid = !admin.isAdmin ? admin.adminId : user.uid;

	const file = await getUserFile(userid, params.fileId);
	invariant(file, "file not found");
	const {
		fileName,
		fileDescription,
		isPublished,
		contentType,
		size,
		createdAt,
		updatedAt,
	} = file;

	// for demo
	const filename = !admin.isAdmin ? "demo.zip" : fileName;
	const desc = !admin.isAdmin ? "file description for demo" : fileDescription;

	return {
		file: {
			fileName: filename,
			fileDescription: desc,
			isPublished,
			contentType,
			size,
			createdAt,
			updatedAt,
		},
	};
};

export const action = async ({ params, request }: Route.ActionArgs) => {
	invariant(params.fileId, "params.fileId is required");
	const user = await requireAuth(request);
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	try {
		if (submission.status !== "success") {
			return {
				success: false,
				message: null,
				submission: submission.reply(),
			};
		}
		const admin = requireAdmin(user.email ?? "");
		if (!admin.isAdmin) {
			return {
				success: false,
				message: "This is demo app. You can't edit file.",
				submission: null,
			};
		}

		const { fileDescription, isPublished } = submission.value;
		const writeResult = await updateUserFile(user.uid, params.fileId, {
			fileDescription,
			isPublished,
		});

		if (!writeResult.writeTime) {
			throw new Error("failed to save file data");
		}
		if (writeResult.id) {
			return redirect(`/files/${writeResult.id}/edit`) as never;
		}
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

export default function Page({ loaderData, actionData }: Route.ComponentProps) {
	const { file } = loaderData;
	const [form, fields] = useForm({
		lastResult: actionData?.submission,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	const {
		fileName,
		contentType,
		size,
		createdAt,
		updatedAt,
		fileDescription,
		isPublished,
	} = file;

	const _size = convertByteWithUnit(size);
	const _createdAt = format(createdAt, "yyyy-MM-dd");
	const _updatedAt =
		createdAt !== updatedAt ? format(updatedAt, "yyyy-MM-dd") : undefined;

	return (
		<main className="py-12">
			<Container>
				<section>
					<h1 className="break-all">{fileName}</h1>
					<div className="flex flex-wrap justify-center gap-4">
						<div className="flex items-center gap-2 text-sm">
							<UploadIcon className="w-4 h-4 fill-current" />
							<span className="sr-only">公開</span>
							<time dateTime={createdAt.toISOString()}>{_createdAt}</time>
						</div>
						{createdAt !== updatedAt && (
							<div className="flex items-center gap-2 text-sm">
								<HistoryIcon className="w-5 h-5 fill-current" />
								<span className="sr-only">更新</span>
								<time dateTime={updatedAt.toISOString()}>{_updatedAt}</time>
							</div>
						)}
						<div className="flex items-center gap-2 text-sm">
							<FileIcon className="w-4 h-4 fill-current" />
							<span className="sr-only">ファイルタイプ</span>
							<span>{contentType}</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<FileIcon className="w-4 h-4 fill-current" />
							<span className="sr-only">ファイルサイズ</span>
							<span>{_size}</span>
						</div>
					</div>
					<h2 className="text-center">ファイル編集</h2>
					<div className="max-w-2xl mx-auto flex flex-col gap-8">
						{actionData && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message ?? ""}
							</Alert>
						)}
						<Form method="post" {...getFormProps(form)} noValidate>
							<fieldset className="fieldset max-w-xl mx-auto gap-8">
								<label>
									<div className="flex gap-8 items-center">
										<legend className="fieldset-legend text-base">
											公開する
										</legend>
										<input
											className={clsx(
												"toggle toggle-primary",
												fields.isPublished.valid && "validator",
											)}
											{...getInputProps(fields.isPublished, {
												type: "checkbox",
											})}
											defaultChecked={isPublished}
										/>
									</div>
								</label>
								<label className="flex flex-col gap-2">
									<legend className="fieldset-legend text-base">説明</legend>
									<div className="fieldset-label">
										{MAX_FILE_DESCRIPTION_LENGTH}文字まで
									</div>
									<Textarea
										placeholder="ファイル説明文（markdown記法使用可能）"
										isError={!fields.fileDescription.valid}
										{...getTextareaProps(fields.fileDescription)}
										defaultValue={fileDescription ?? ""}
										className={clsx(
											"w-full",
											fields.fileDescription.valid && "validator",
										)}
									/>
									<div className="validator-hint text-error">
										{fields.fileDescription.errors}
									</div>
								</label>
								<button type="submit" className="btn btn-primary">
									更新する
								</button>
							</fieldset>
						</Form>
						<Link
							to="/dashboard"
							className="link text-base text-center no-underline link-hover"
						>
							ファイルの管理へ戻る
						</Link>
					</div>
				</section>
			</Container>
		</main>
	);
}

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Container } from "@/components/Container";
import { MAX_FILE_DESCRIPTION_LENGTH } from "@/constant";
import { Form, Link } from "@remix-run/react";
import {
	typedjson,
	useTypedActionData,
	useTypedLoaderData,
} from "remix-typedjson";
import invariant from "tiny-invariant";
import { requireAuth } from "../server/auth.server";
import { getUserFile, updateUserFile } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.fileId, "params.fileId is required");
	const user = await requireAuth(request);
	const file = await getUserFile(user.uid, params.fileId);
	invariant(file, "file not found");

	return typedjson({
		file,
	});
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
	invariant(params.fileId, "params.fileId is required");
	const form = await request.formData();
	const fileName = form.get("fileName");
	const fileDescription = form.get("fileDescription");
	const publish = form.get("publish");
	const formError = json({ error: "Please fill all fields!" }, { status: 400 });
	try {
		if (typeof fileName !== "string") return formError;
		if (typeof fileDescription !== "string") return formError;
		if (MAX_FILE_DESCRIPTION_LENGTH < fileDescription.length) {
			throw new Error(
				`Description is limited to ${MAX_FILE_DESCRIPTION_LENGTH} characters.`,
			);
		}
		if (typeof publish !== "string" && publish !== null) return formError;
		const isPublished = Boolean(publish);
		const user = await requireAuth(request);
		const { writeTime } = await updateUserFile(user.uid, params.fileId, {
			fileName,
			fileDescription,
			isPublished,
		});

		return json({
			writeTime,
		});
	} catch (error) {
		console.error(error);
		return json({ error: String(error) }, { status: 401 });
	}
};

export default function Index() {
	const { file } = useTypedLoaderData<typeof loader>();
	const actionData = useTypedActionData<typeof action>();
	const { fileName, fileDescription, isPublished } = file;

	return (
		<article>
			{/* {actionData && <pre>{JSON.stringify(actionData, null, 2)}</pre>} */}
			<Container>
				<section className="py-16">
					<h1 className="text-center">ファイル編集</h1>
					<div className="max-w-2xl mx-auto">
						<Form method="post" className="flex flex-col gap-8">
							<label className="form-control">
								<div className="label">
									<span className="label-text">ファイル名</span>
									<span className="label-text-alt">必須</span>
								</div>
								<input
									type="text"
									name="fileName"
									required
									placeholder="File name"
									className="input input-bordered"
									defaultValue={fileName}
								/>
								<div className="label">
									<span className="label-text-alt">Alt label</span>
								</div>
							</label>
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">公開する</span>
									<input
										type="checkbox"
										name="publish"
										className="toggle toggle-primary"
										defaultChecked={isPublished}
									/>
								</label>
							</div>
							<label className="form-control">
								<div className="label">
									<span className="label-text">説明文</span>
									<span className="label-text-alt">必須</span>
								</div>
								<textarea
									name="fileDescription"
									placeholder="Bio"
									required
									defaultValue={fileDescription}
									className="textarea textarea-bordered text-base"
									// @ts-ignore
									style={{ fieldSizing: "content" }}
								/>
								<div className="label">
									<span className="label-text-alt" />
									<span className="label-text-alt">
										{MAX_FILE_DESCRIPTION_LENGTH}文字まで
									</span>
								</div>
							</label>
							<button type="submit" className="btn btn-block btn-primary">
								保存する
							</button>
						</Form>
						<Link to="/dashboard" className="btn btn-secondary btn-block mt-8">
							ダッシュボードへ戻る
						</Link>
					</div>
				</section>
			</Container>
		</article>
	);
}

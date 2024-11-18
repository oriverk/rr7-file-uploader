import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Form, Link } from "@remix-run/react";
import {
	typedjson,
	useTypedActionData,
	useTypedLoaderData,
} from "remix-typedjson";
import invariant from "tiny-invariant";
import { ContentSection } from "../components/ContentSection";
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
		<div>
			{actionData && <pre>{JSON.stringify(actionData, null, 2)}</pre>}
			<ContentSection>
				<Form method="post" className="flex flex-col gap-8 w-96">
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">ファイル名</span>
							<span className="label-text-alt">必須</span>
						</div>
						<input
							type="text"
							name="fileName"
							required
							placeholder="File name"
							className="input input-bordered w-full"
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
								className="toggle"
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
							className="textarea textarea-bordered h-24 w-full"
						/>
						<div className="label">
							<span className="label-text-alt">Alt label</span>
						</div>
					</label>
					<button type="submit" className="btn btn-block btn-primary">
						保存する
					</button>
				</Form>
				<Link to="/dashboard" className="btn btn-secondary btn-block mt-8">
					ダッシュボードへ戻る
				</Link>
			</ContentSection>
		</div>
	);
}

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { ContentSection } from "../components/ContentSection";
import { firestore } from "../server/firebase.server";
import { getUserFile } from "../server/firestore.server";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";
import { parseMarkdown } from "../utils/markdown";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.uid, "params.uid is requied");
	invariant(params.fileId, "params.fileId is required");
	const { uid } = params;
	const userSnapshot = await firestore
		.collection("users")
		.where("uid", "==", params.uid)
		.limit(1)
		.get();
	invariant(!userSnapshot.empty, "user not found");
	const userDoc = userSnapshot.docs[0];
	const user = userDoc.data();

	const { displayName, profile, profileImageUrl } = user;
	const userId = userDoc.id;
	const file = await getUserFile(userId, params.fileId);

	invariant(file, `File not found: ${params.fileId}`);

	const { fileDescription, size, filePath, deletedAt, ...rest } = file;
	const html = parseMarkdown(fileDescription ?? "");
	return typedjson({
		uid,
		file: {
			fileDescription: html,
			size: convertByteWithUnit(size ?? 0),
			...rest,
		},
	});
};

export default function UserFile() {
	const { uid, file } = useTypedLoaderData<typeof loader>();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const { fileName } = file;

	const handleConfirm = () => {
		setIsConfirmed(!isConfirmed);
	};

	const handleDownload = () => {
		setIsConfirmed(false);
	};

	return (
		<div className="text-center">
			<hgroup>
				<h1>{fileName}</h1>
				<p className="text-2xl">by {uid}</p>
			</hgroup>

			<ContentSection title="Download">
				<p>
					ダウンロードを続けるには、
					<Link to="/terms" className="link">
						利用規約
					</Link>
					に同意した上で「ダウンロード」ボタンを押下してください。ダウンロードが開始されます。
				</p>

				<div className="form-control mb-4">
					<label className="label cursor-pointer">
						<input
							type="checkbox"
							name="confirm"
							checked={isConfirmed}
							onChange={handleConfirm}
							className="checkbox checkbox-primary"
						/>
						<span className="label-text ml-4">同意する</span>
					</label>
				</div>
				{isConfirmed && (
					<Link
						to="execute"
						download
						reloadDocument
						onClick={handleDownload}
						className="btn btn-block btn-primary"
					>
						ダウンロードする
					</Link>
				)}
			</ContentSection>
		</div>
	);
}
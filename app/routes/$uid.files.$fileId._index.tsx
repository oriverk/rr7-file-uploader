import { formatDate } from "@/utils/formatDate";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
	const {
		fileName,
		contentType,
		size,
		createdAt,
		updatedAt,
		downloadCount,
		fileDescription,
	} = file;
	const create = formatDate(new Date(createdAt));
	const lastUpdate = formatDate(new Date(updatedAt));

	return (
		<div className="text-center">
			<hgroup>
				<h1>{fileName}</h1>
				<p className="text-2xl">by {uid}</p>
			</hgroup>
			<ContentSection>
				<div className="overflow-x-auto">
					<table className="table">
						<tbody>
							<tr>
								<th>ファイル</th>
								<td>{fileName}</td>
							</tr>
							<tr>
								<th>ファイルタイプ</th>
								<td>{contentType}</td>
							</tr>
							<tr>
								<th>サイズ</th>
								<td>{size}</td>
							</tr>
							<tr>
								<th>作成日</th>
								<td>
									<time dateTime={createdAt}>{create}</time>
								</td>
							</tr>
							<tr>
								<th>最終更新日</th>
								<td>
									<time dateTime={updatedAt}>{lastUpdate}</time>
								</td>
							</tr>
							<tr>
								<th>ダウンロード数</th>
								<td>{downloadCount}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</ContentSection>
			<ContentSection>
				<div
					dangerouslySetInnerHTML={{ __html: fileDescription }}
					className="text-left mx-auto max-w-3xl lg:prose-lg prose-h2:underline prose-img:rounded-xl"
				/>
			</ContentSection>
			<ContentSection>
				<Link to="download" className="btn btn-primary">
					ダウロードページへ
				</Link>
			</ContentSection>
		</div>
	);
}
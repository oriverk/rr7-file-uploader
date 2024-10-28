import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { ContentSection } from "../components/ContentSection";
import { getUserFile } from "../server/firestore.server";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";
import { parseMarkdown } from "../utils/markdown";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.uid, "params.uid is requied");
	invariant(params.fileId, "params.fileId is required");
	const { uid } = params;
	const file = await getUserFile(params.uid, params.fileId);
	invariant(file, `File not found: ${params.fileId}`);

	const { description, size, fullPath, password, deletedAt, ...rest } = file;
	const html = parseMarkdown(description);
	return typedjson({
		uid,
		file: {
			description: html,
			size: convertByteWithUnit(size),
			...rest,
		},
	});
};

export default function Index() {
	const { uid, file } = useTypedLoaderData<typeof loader>();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const { name, contentType, size, updatedAt, downloaded, description } = file;

	const handleConfirm = () => {
		setIsConfirmed(!isConfirmed);
	};

	const handleDownload = () => {
		setIsConfirmed(false);
	};

	return (
		<div className="text-center">
			<hgroup>
				<h1>{name}</h1>
				<p className="text-2xl">by {uid}</p>
			</hgroup>
			<ContentSection>
				<div className="overflow-x-auto">
					<table className="table">
						<tbody>
							<tr>
								<th>name</th>
								<td>{name}</td>
							</tr>
							<tr>
								<th>type</th>
								<td>{contentType}</td>
							</tr>
							<tr>
								<th>size</th>
								<td>{size}</td>
							</tr>
							<tr>
								<th>updated at</th>
								<td>
									<time dateTime={updatedAt} title={`更新：${updatedAt}`}>
										{updatedAt}
									</time>
								</td>
							</tr>
							<tr>
								<th>downloaded</th>
								<td>{downloaded}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</ContentSection>
			<ContentSection title="description">
				<div
					dangerouslySetInnerHTML={{ __html: description }}
					className="text-left mx-auto max-w-3xl lg:prose-lg prose-h2:underline prose-img:rounded-xl"
				/>
			</ContentSection>
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
							onClick={handleConfirm}
							className="checkbox checkbox-primary"
						/>
						<span className="label-text ml-4">同意する</span>
					</label>
				</div>
				{isConfirmed && (
					<Link
						to="download"
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

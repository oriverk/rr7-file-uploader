import type { FirestoreFile } from "@/types/firestore";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { DownloadIcon, FileIcon } from "./icons";

type Props = {
	file: FirestoreFile;
	path: string;
	isAuthenticatd?: boolean;
};

export function FileCard(props: Props) {
	const { file, path } = props;
	const { fileName, downloadCount, size, createdAt, updatedAt } = file;
	const _size = convertByteWithUnit(size);
	const _createdAt = format(createdAt, "yyyy年MM月dd日");
	const _updatedAt =
		createdAt !== updatedAt ? format(updatedAt, "yyyy年MM月dd日") : undefined;

	return (
		<div className="card bg-neutral text-neutral-content shadow-lg">
			<div className="card-body gap-4">
				<h2 className="card-title m-0">
					<Link to={path} className="link link-hover">
						{fileName}
					</Link>
				</h2>
				<div className="card-actions gap-4">
					<div>
						<span>公開：</span>
						<time dateTime={createdAt.toISOString()}>{_createdAt}</time>
					</div>
					{!!_updatedAt && (
						<div>
							<span>更新：</span>
							<time dateTime={updatedAt.toISOString()}>{_updatedAt}</time>
						</div>
					)}
				</div>
				<div className="card-actions items-center gap-4">
					<div className="flex items-center gap-2 text-sm">
						<FileIcon className="w-4 h-4 fill-current" />
						<span className="sr-only">ファイルサイズ</span>
						<span>{_size}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<DownloadIcon className="w-4 h-4 fill-current" />
						<span className="sr-only">ダウンロード数</span>
						<span>{downloadCount}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

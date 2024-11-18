import type { FirestoreFile } from "@/types/firestore";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { formatDate } from "@/utils/formatDate";
import { Link } from "@remix-run/react";
import { DownloadIcon, FileIcon } from "./icons";

type Props = {
	file: FirestoreFile;
	path: string;
	isAuthenticatd?: boolean;
};

export function FileCard(props: Props) {
	const { file, path } = props;
	const { fileName, downloadCount, size, createdAt, updatedAt } = file;

	const create = formatDate(createdAt);
	const update = formatDate(updatedAt);
	const sizeStr = convertByteWithUnit(size);
	return (
		<div className="card bg-neutral text-neutral-content shadow-lg">
			<div className="card-body gap-4">
				<h2 className="card-title m-0">
					<Link to={path} className="link link-hover">
						{fileName}
					</Link>
				</h2>
				<div className="card-actions gap-4">
					<div className="">
						<span>作成：</span>
						{create}
					</div>
					<div className="">
						<span>更新：</span>
						{update}
					</div>
				</div>
				<div className="card-actions gap-4">
					<div className="flex items-center gap-2 text-sm">
						<FileIcon className="w-4 h-4 fill-current" />
						<span>ファイルサイズ</span>
						<span>{sizeStr}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<DownloadIcon className="w-4 h-4 fill-current" />
						<span>ダウンロード数</span>
						<span>{downloadCount}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

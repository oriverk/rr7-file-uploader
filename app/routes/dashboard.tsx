import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { DashboardFileCard } from "@/components/DashboradFileCard";
import { CloseIcon } from "@/components/icons";
import { requireAuth } from "@/server/auth.server";
import { getUserFiles, softDeleteUserFile } from "@/server/firestore.server";
import { json, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ContentSection } from "../components/ContentSection";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const user = await requireAuth(request);
	const files = await getUserFiles(user.uid, false);

	return typedjson({
		user,
		files,
	});
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const form = await request.formData();
	const fileId = form.get("fileId");
	const user = await requireAuth(request);

	try {
		if (typeof fileId !== "string") {
			throw new Error("");
		}
		const result = await softDeleteUserFile(user.uid, fileId);
		if (!result.writeTime) {
			throw new Error("");
		}

		return json({
			success: true,
		});
	} catch (error) {
		console.error("File delete failed:", error);
		return json({ error: String(error) }, { status: 401 });
	}
};

type DeletingFile = Record<"fileId" | "fileName", string>;

export default function Dashboard() {
	const { user, files } = useTypedLoaderData<typeof loader>();
	const [deletingFile, setDeletingFile] = useState<DeletingFile | null>(null);
	const submit = useSubmit();
	const dialog = useRef<HTMLDialogElement>(null);

	const handleOpenModal = (file: DeletingFile) => {
		if (!dialog.current) return;
		const { fileId, fileName } = file;
		setDeletingFile({ fileId, fileName });
		dialog.current.showModal();
	};

	const handleCloseModal = () => {
		if (!dialog.current) return;
		setDeletingFile((prev) => null);
		dialog.current.close();
	};

	const handleDelete = () => {
		if (!dialog.current) return;
		if (!deletingFile) return;
		const { fileId } = deletingFile;
		submit({ fileId }, { method: "post" });
		dialog.current.close();
	};

	return (
		<div>
			<h1 className="text-center">{user.uid} files</h1>
			<ContentSection title="files">
				<div className="flex flex-col gap-8">
					{files.map((file) => {
						const { id: fileId, fileName } = file;
						const path = `/files/${fileId}/edit`;
						return (
							<article key={fileId} className="relative">
								<div className="absolute top-7 right-8 z-10">
									<button
										tabIndex={0}
										type="button"
										onClick={() => handleOpenModal({ fileId, fileName })}
										className="group btn btn-ghost hover:btn-error btn-sm m-1"
									>
										<CloseIcon className="h-4 w-4 fill-current group-hover:fill-error" />
									</button>
								</div>
								<DashboardFileCard path={path} file={file} />
							</article>
						);
					})}
				</div>
			</ContentSection>
			<dialog id="my_modal_1" className="modal" ref={dialog}>
				<div className="modal-box">
					<h3 className="font-bold text-lg text-center">削除しますか？</h3>
					<p className="py-4">
						{/* @ts-ignore */}
						{`ファイル「${deletingFile?.fileName}」を削除しようとしています。この操作は戻すことができません。`}
					</p>
					<div className="modal-action">
						<form method="dialog">
							<button type="button" onClick={handleCloseModal} className="btn">
								キャンセル
							</button>
							<button
								type="button"
								onClick={handleDelete}
								className="btn btn-error"
							>
								削除する
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
}

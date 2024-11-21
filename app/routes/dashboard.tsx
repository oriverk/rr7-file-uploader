import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { Container } from "@/components/Container";
import { DashboardFileCard } from "@/components/DashboradFileCard";
import { Pagination } from "@/components/Pagination";
import { CloseIcon } from "@/components/icons";
import { usePagination } from "@/hooks/usePagination";
import { requireAuth } from "@/server/auth.server";
import { getUserFiles, softDeleteUserFile } from "@/server/firestore.server";
import type { FirestoreFile } from "@/types/firestore";
import { json, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

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
	const { currentItems, endIndex, goToPage, nextPage, prevPage } =
		usePagination<FirestoreFile>(files, 10, 1);
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
		<>
			<article className="py-12">
				<Container>
					<section>
						<h1 className="text-center">ファイル管理</h1>
						<div className="flex flex-col gap-8 items-center">
							<Pagination
								handleFirstPage={() => goToPage(1)}
								handlePreviousPage={prevPage}
								handleNextPage={nextPage}
								handleLastPage={() => goToPage(endIndex)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
								{currentItems.map((file) => {
									const { id, fileName } = file;
									const path = `/files/${id}/edit`;
									return (
										<div key={id}>
											<DashboardFileCard
												path={path}
												file={file}
												handleClickDelete={() =>
													handleOpenModal({ fileId: id ?? "", fileName })
												}
											/>
										</div>
									);
								})}
							</div>
							<Pagination
								handleFirstPage={() => goToPage(1)}
								handlePreviousPage={prevPage}
								handleNextPage={nextPage}
								handleLastPage={() => goToPage(endIndex)}
							/>
						</div>
					</section>
				</Container>
			</article>
			{/* dialog */}
			<dialog className="modal" ref={dialog}>
				<div className="modal-box">
					<h3 className="font-bold text-lg text-center">削除しますか？</h3>
					<p className="py-4">
						{/* @ts-ignore */}
						{`ファイル「${deletingFile?.fileName}」を削除しようとしています。この操作は戻すことができません。`}
					</p>
					<div className="modal-action justify-center">
						<form method="dialog" className="flex gap-8">
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
		</>
	);
}

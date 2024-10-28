import type { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { ContentSection } from "../components/ContentSection";
import { FilesTable } from "../components/FilesTable";
import { getUserFiles } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.uid, "params.uid is required");
	const files = await getUserFiles(params.uid);
	invariant(files.length, `Files not found: ${params.uid}`);
	const { uid } = params;

	return typedjson({
		uid,
		files,
	});
};

export default function Index() {
	const { uid, files } = useTypedLoaderData<typeof loader>();
	return (
		<div>
			<h1 className="text-center">{uid} files</h1>
			<ContentSection title="file index">
				<FilesTable uid={uid} files={files} pageSize={5} />
			</ContentSection>
		</div>
	);
}

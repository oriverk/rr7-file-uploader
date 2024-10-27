import type { LoaderFunctionArgs } from "@remix-run/node";
// import type { MetaFunction } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import markdown from "../docs/lorem.md?raw";
import { parseMarkdown } from "../utils/markdown";

// export const meta: MetaFunction = () => {
// 	return [
// 		{ title: "Terms of Use" },
// 		{
// 			name: "description",
// 			content: "Welcome to Remix! Using Vite and Cloudflare!",
// 		},
// 	];
// };

export const loader = ({ params, request }: LoaderFunctionArgs) => {
	const html = parseMarkdown(markdown);
	return typedjson({
		html,
	});
};

export default function Index() {
	const { html } = useTypedLoaderData<typeof loader>();
	return (
		<article
			className="prose mx-auto max-w-3xl lg:prose-lg"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

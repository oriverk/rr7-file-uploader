import { Container } from "@/components/Container";
import type { LoaderFunctionArgs } from "@remix-run/node";
// import type { MetaFunction } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import markdown from "../docs/privacy-policy.md?raw";
import { parseMarkdown } from "../utils/markdown";

// export const meta: MetaFunction = () => {
// 	return [
// 		{ title: "Privacy Policy" },
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

export default function Privacy() {
	const { html } = useTypedLoaderData<typeof loader>();
	return (
		<article>
			<Container>
				<div
					className="prose mx-auto py-12 max-w-3xl lg:prose-lg"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</Container>
		</article>
	);
}

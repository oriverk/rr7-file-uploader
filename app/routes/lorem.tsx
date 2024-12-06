import { Container } from "@/components/Container";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import markdown from "../docs/lorem.md?raw";
import { parseMarkdown } from "../utils/markdown";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
	const html = parseMarkdown(markdown);
	return {
		html,
	};
};

export default function Lorem() {
	const { html } = useLoaderData<typeof loader>();
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

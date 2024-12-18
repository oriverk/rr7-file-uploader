import { Container } from "@/components/Container";
import markdown from "@/docs/privacy-policy.md?raw";
import { parseMarkdown } from "@/utils/markdown";
import type { Route } from "./+types/privacy";

export const loader = ({ params, request }: Route.LoaderArgs) => {
	const html = parseMarkdown(markdown);
	return {
		html,
	};
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { html } = loaderData;
	return (
		<main className="py-12">
			<article>
				<Container>
					<div
						className="prose mx-auto py-12 max-w-3xl lg:prose-lg"
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</Container>
			</article>
		</main>
	);
}

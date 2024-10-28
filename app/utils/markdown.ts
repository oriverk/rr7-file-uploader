import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

export function parseMarkdown(markdown: string) {
	const result = micromark(markdown, {
		allowDangerousHtml: false,
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
	});
	return result;
}

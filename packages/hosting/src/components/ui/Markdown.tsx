import { FC } from "react";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

function parseMarkdown(markdown: string) {
  const result = micromark(markdown, {
    allowDangerousHtml: true,
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });
  return result;
}

export const Markdown: FC<{ markdown: string }> = (props) => {
  const { markdown } = props;
  const html = parseMarkdown(markdown);

  return (
    <article
      className="prose mx-auto max-w-3xl prose-headings:underline prose-a:text-blue-600 prose-img:rounded-xl lg:prose-lg"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

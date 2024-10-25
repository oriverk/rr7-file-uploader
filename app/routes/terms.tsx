import type { MetaFunction } from "@remix-run/react";
import { Markdown } from "../components/ui/Markdown"
import markdown from "../docs/term-of-service.md?raw"

// export const meta: MetaFunction = () => {
// 	return [
// 		{ title: "Terms of Use" },
// 		{
// 			name: "description",
// 			content: "Welcome to Remix! Using Vite and Cloudflare!",
// 		},
// 	];
// };

export default function Index() {
  return (
    <Markdown markdown={markdown} />
  )
}

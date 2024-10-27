import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	type MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from "@remix-run/react";

import { Footer, Header } from "./components/layout";

import type { ReactNode } from "react";
import tailwind from "./styles/tailwind.css?url";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
	{ rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
	{ rel: "apple-touch-icon", href: "/favicon/favicon.svg" },
];

export const meta: MetaFunction = () => {
	return [
		{ title: "Very cool app | Remix" },
		{ charSet: "utf-8" },
		{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
		{ name: "format-detection", content: "email=no,telephone=no,address=no" },
		{ name: "apple-mobile-web-app-title", content: "👆 Uploader" },
		{ name: "author", content: "hogehoge" },
		{ name: "theme-color", content: "#00e1ee" },
		{ property: "og:type", content: "article" },
		{ name: "og:site_name", content: "👆 Uploader" },
		{ name: "twitter:card", content: "summary_large_image" },
		{ property: "og:title", content: "Very cool app" },
		{ name: "description", content: "This app is the best" },
	];
};

type Props = {
	children: ReactNode;
};

export function Layout(props: Props) {
	const { children } = props;
	return (
		<html lang="ja-JP" data-theme="synthwave">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="min-h-screen flex flex-col">
					<Header />
					<main className="prose max-w-none">{children}</main>
					<Footer />
				</div>
				<ScrollRestoration />
				<Scripts />
				{/* <LiveReload /> */}
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</>
		);
	}

	return (
		<>
			<h1>Error!</h1>
			{/* @ts-ignore */}
			<p>{error?.message ?? "Unknown error"}</p>
		</>
	);
}

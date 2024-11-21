import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
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
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { checkSessionCookie } from "./server/auth.server";
import { getSession } from "./sesions";
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("cookie"));
	const result = await checkSessionCookie(session);
	const { uid } = result;

	// @ts-ignore
	const name = result.name;
	return typedjson({ isAuthenticated: Boolean(uid), uid, name });
};

type Props = {
	children: ReactNode;
};

export function Layout(props: Props) {
	const { isAuthenticated, name } = useTypedLoaderData<typeof loader>();
	// const isAuthenticated = true;
	// const name = "ixanary";
	const { children } = props;
	return (
		<html lang="ja-JP" data-theme="dim">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="min-h-screen flex flex-col">
					<Header isAuthenticated={isAuthenticated} name={name} />
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

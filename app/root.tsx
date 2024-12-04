import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
	Links,
	Meta,
	type MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useLoaderData,
	useLocation,
	useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import * as gtag from "./utils/gtags.client";

import { Footer, Header } from "./components/layout";

import type { ReactNode } from "react";
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
		{ title: "Uploader" },
		{ charSet: "utf-8" },
		{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
		{ name: "format-detection", content: "email=no,telephone=no,address=no" },
		{ name: "apple-mobile-web-app-title", content: "👆 Uploader" },
		{ name: "author", content: "hogehoge" },
		{ name: "theme-color", content: "#00e1ee" },
		{ property: "og:type", content: "article" },
		{ name: "og:site_name", content: "👆 Uploader" },
		{ name: "twitter:card", content: "summary_large_image" },
		{ property: "og:title", content: "upload and download files" },
		{ name: "description", content: "Web app to upload / download file" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("cookie"));
	const result = await checkSessionCookie(session);
	const isAuthenticated = Boolean(result.uid);
	const name: string = "name" in result ? result.name : "";
	const gaTrackingId = process.env.GA_TRACKING_ID
	return json({ isAuthenticated, name, gaTrackingId });
};

type Props = {
	children: ReactNode;
};

export function Layout(props: Props) {
	const { children } = props;
	const location = useLocation();
	const loaderData = useLoaderData<typeof loader>();
	const { gaTrackingId } = loaderData
	
	useEffect(() => {
		if (gaTrackingId?.length) {
			gtag.pageview(location.pathname, gaTrackingId);
		}
	}, [location, gaTrackingId])

	return (
		<html lang="ja-JP" data-theme="dim">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="min-h-screen flex flex-col">
					<Header
						isAuthenticated={loaderData?.isAuthenticated ?? false}
						name={loaderData?.name ?? ""}
					/>
					<main className="prose prose-h1:text-center max-w-none">
						{children}
					</main>
					<Footer />
				</div>
				<ScrollRestoration />
				<Scripts />
				{/* <LiveReload /> */}
				{process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
					<>
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
						/>
						<script
							async
							id="gtag-init"
							dangerouslySetInnerHTML={{
								__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
							}}
						/>
					</>
				)}
				{process.env.NODE_ENV === "development" ? null : (
					<>
						<script
							async
							src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3305972869013074"
							crossOrigin="anonymous"
						/>
						<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
					</>
				)}
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
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</div>
		);
	}

	if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	}

	return <h1>Unknown Error</h1>;
}

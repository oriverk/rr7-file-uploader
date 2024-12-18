import { useEffect } from "react";
import * as gtag from "./utils/gtags.client";

import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useLocation,
	useRouteError,
} from "react-router";
import { Footer, Header } from "./components/layout";

import { Container } from "./components/Container";
import { checkSessionCookie } from "./server/auth.server";
import { getSession } from "./sesions";
import tailwind from "./styles/tailwind.css?url";

import type { Route } from "./+types/root";
import { GoogleAnalytics } from "./components/GoogleAnalytics";

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
	{ rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
	{ rel: "apple-touch-icon", href: "/favicon/favicon.svg" },
];

export function meta() {
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
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const session = await getSession(request.headers.get("cookie"));
	const result = await checkSessionCookie(session);
	const isAuthenticated = Boolean(result.uid);
	const name: string = "name" in result ? result.name : "";
	const gaTrackingId = process.env.GA_TRACKING_ID;
	return { isAuthenticated, name, gaTrackingId };
};

type DocumentProps = {
	title?: string;
	isDev?: boolean;
	noIndex?: boolean;
	children: React.ReactNode;
	gaTrackingId?: string;
};

function Document(props: DocumentProps) {
	const { title, isDev, noIndex, children, gaTrackingId } = props;
	const location = useLocation();

	useEffect(() => {
		if (gaTrackingId?.length) {
			gtag.pageview(location.pathname, gaTrackingId);
		}
	}, [location, gaTrackingId]);

	return (
		<html lang="ja-JP" data-theme="dim">
			<head>
				{noIndex && <meta name="robots" content="noindex" />}
				<Meta />
				<Links />
				{title && <title>{title}</title>}
				{isDev ? null : (
					<>
						<script
							async
							src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3305972869013074"
							crossOrigin="anonymous"
						/>
					</>
				)}
			</head>
			<body className="flex min-h-screen w-full flex-col overflow-x-hidden antialiased">
				{children}
				<ScrollRestoration />
				<Scripts />
				{isDev || !gaTrackingId ? null : (
					<GoogleAnalytics trackingId={gaTrackingId} />
				)}
			</body>
		</html>
	);
}

export default function App({ loaderData }: Route.ComponentProps) {
	const location = useLocation();
	const isAuthenticated = loaderData?.isAuthenticated ?? false;
	const name = loaderData?.name ?? "";
	const gaTrackingId = loaderData?.gaTrackingId ?? "";

	useEffect(() => {
		if (gaTrackingId?.length) {
			gtag.pageview(location.pathname, gaTrackingId);
		}
	}, [location, gaTrackingId]);

	return (
		<Document>
			<div className="flex h-hull flex-1 flex-col">
				<Header isAuthenticated={isAuthenticated} name={name} />
				<Outlet />
				<Footer />
			</div>
		</Document>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<article>
				<Container
					maxWidth="wide"
					className="not-prose hero max-w-none min-h-screen"
				>
					<div className="hero-content text-center">
						<div className="max-w-md">
							<h1 className="text-5xl font-bold">
								{error.status} {error.statusText}
							</h1>
							<p className="py-6">{error.data}</p>
							<Link to="/" className="link link-primary">
								Back to home
							</Link>
						</div>
					</div>
				</Container>
			</article>
		);
	}

	if (error instanceof Error) {
		return (
			<article>
				<Container
					maxWidth="wide"
					className="not-prose hero max-w-none min-h-screen"
				>
					<div className="hero-content text-center">
						<div className="max-w-md">
							<h1>Error</h1>
							<p>{error.message}</p>
							<p>The stack trace is:</p>
							<pre>{error.stack}</pre>
							<Link to="/" className="link link-primary">
								Back to home
							</Link>
						</div>
					</div>
				</Container>
			</article>
		);
	}

	return <h1>Unknown Error</h1>;
}

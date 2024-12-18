import { Container } from "@/components/Container";
import { destroySession, getSession } from "@/sesions";
import { redirect } from "react-router";

import type { Route } from "./+types/logout";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/", {
		headers: { "Set-Cookie": await destroySession(session) },
	});
};

export default function Logout() {
	return (
		<main>
			<article>
				<Container
					maxWidth="wide"
					className="not-prose hero max-w-none min-h-screen"
				>
					<div className="hero-content text-center">
						<div className="max-w-md">
							<h1 className="text-5xl font-bold">Logout</h1>
						</div>
					</div>
				</Container>
			</article>
		</main>
	);
}

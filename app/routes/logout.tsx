import { Container } from "@/components/Container";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sesions";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/", {
		headers: { "Set-Cookie": await destroySession(session) },
	});
};

export default function Logout() {
	return (
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
	);
}

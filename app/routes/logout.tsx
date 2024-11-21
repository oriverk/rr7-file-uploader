import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { Container } from "@/components/Container";
import { destroySession, getSession } from "../sesions";

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/", {
		headers: { "Set-Cookie": await destroySession(session) },
	});
};

export default function Logout() {
	return (
		<article>
			<Container>
				<section>
					<h1 className="text-center">Logout</h1>
					<div>
						<p>Press the button below to log out.</p>
						<Form method="post">
							<button type="submit" className="not-prose btn btn-primary">
								Logout
							</button>
						</Form>
					</div>
				</section>
			</Container>
		</article>
	);
}

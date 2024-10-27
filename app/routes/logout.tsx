import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { ContentSection } from "../components/ContentSection";
import { destroySession, getSession } from "../sesions";

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/", {
		headers: { "Set-Cookie": await destroySession(session) },
	});
};

export default function Logout() {
	return (
		<div>
			<h1>Logout</h1>
			<ContentSection>
				<p>Press the button below to log out.</p>
				<Form method="post">
					<button type="submit" className="not-prose btn btn-primary">
						Logout
					</button>
				</Form>
			</ContentSection>
		</div>
	);
}

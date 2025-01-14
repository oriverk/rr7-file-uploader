import { destroySession, getSession } from "@/server/sesions.server";
import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/", {
		headers: { "Set-Cookie": await destroySession(session) },
	});
};

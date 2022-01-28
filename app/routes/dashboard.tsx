import { LoaderFunction, redirect, useLoaderData } from "remix";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("access_token")) {
    return redirect("/");
  }

  const accessToken = session.get("accessToken");

  return {};
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
    </div>
  );
}

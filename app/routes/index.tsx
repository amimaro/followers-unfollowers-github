import { LoaderFunction, redirect, useLoaderData } from "remix";
import { getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    return redirect("/dashboard");
  }

  return {
    ENV: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    },
  };
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <form action="https://github.com/login/oauth/authorize">
        <input type="hidden" id="scope" name="scope" value="user:follow" />
        <input
          type="hidden"
          id="client_id"
          name="client_id"
          value={data.ENV.GITHUB_CLIENT_ID}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

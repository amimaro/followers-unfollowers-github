import axios from "axios";
import { LoaderFunction, redirect, useCatch } from "remix";
import { commitSession, getSession } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  let url = new URL(request.url);
  let code = url.searchParams.get("code");

  const { data: response } = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.error) {
    throw new Response("Invalid code request", { status: 400 });
  }

  const { data: profile }: any = await axios.get(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `token ${response.access_token}`,
      },
    }
  );

  session.set("access_token", response.access_token);
  session.set("user", {
    username: profile.login,
    name: profile.name,
    url: profile.html_url,
    avatar: profile.avatar_url,
    followers: profile.followers,
    following: profile.following,
  });

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function OAuth() {
  return <div></div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>TODO</h1>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}

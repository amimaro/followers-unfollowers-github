import axios from "axios";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useSearchParams,
} from "remix";
import { AppPaginator } from "~/components/AppPaginator";
import { AppUsersList } from "~/components/AppUsersList";
import { getSession } from "~/sessions.server";

const checkUserFollows = async (
  username: string,
  targetUser: string,
  accessToken: string
) => {
  return axios.get(
    `https://api.github.com/users/${username}/following/${targetUser}`,
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");
  const formData = await request.formData();

  if (request.method === "DELETE") {
    await axios.delete(
      `https://api.github.com/user/following/${formData.get("user")}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
  } else if (request.method === "PUT") {
    await axios.put(
      `https://api.github.com/user/following/${formData.get("user")}`,
      null,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
  }

  return redirect(
    `/dashboard?page=${formData.get("page")}&section=${formData.get("section")}`
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  let url = new URL(request.url);
  let page = url.searchParams.get("page") || "1";
  let section = url.searchParams.get("section") || "1";

  if (!session.has("access_token")) {
    return redirect("/");
  }

  const accessToken = session.get("access_token");
  const user = session.get("user");
  let followers = [];
  let followings = [];

  if (section === "1") {
    let { data: followingsData }: any = await axios.get(
      `https://api.github.com/users/${user.username}/following?per_page=${process.env.USERS_PER_PAGE}&page=${page}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
    followings = followingsData;
    for (let i = 0; i < followings.length; i++) {
      try {
        await checkUserFollows(followings[i].login, user.username, accessToken);
        followings[i].isFollowingBack = true;
      } catch (error) {
        followings[i].isFollowingBack = false;
      }
    }
  } else {
    let { data: followersData }: any = await axios.get(
      `https://api.github.com/users/${user.username}/followers?per_page=${process.env.USERS_PER_PAGE}&page=${page}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
    followers = followersData;
    for (let i = 0; i < followers.length; i++) {
      try {
        await checkUserFollows(user.username, followers[i].login, accessToken);
        followers[i].isFollowingBack = true;
      } catch (error) {
        followers[i].isFollowingBack = false;
      }
    }
  }

  return {
    user,
    page,
    followers,
    followings,
    ENV: {
      USERS_PER_PAGE: process.env.USERS_PER_PAGE,
    },
  };
};

export default function Index() {
  const data = useLoaderData();
  const [searchParams] = useSearchParams();

  const getMaxUsersPerPage = () => {
    return Math.ceil(
      (getSection() === 0 ? data.user.following : data.user.followers) /
        data.ENV.USERS_PER_PAGE
    );
  };

  const getPage = () => {
    return parseInt(searchParams.get("page") || "1");
  };

  const getSection = () => {
    return parseInt(searchParams.get("section") || "1");
  };

  const tabs = [
    { id: 1, label: "Don't Follow Back" },
    { id: 2, label: "I Don't Follow Back" },
  ];

  return (
    <div className="p-10">
      <div className="flex justify-between pb-5">
        <h1>Dashboard</h1>
        <div>
          <Link to={`/logout`} className="px-4 py-2 underline">
            Logout
          </Link>
        </div>
      </div>
      <div className="flex gap-10 pb-2">
        {tabs.map((tab) => (
          <div key={tab.label}>
            <Link
              to={`/dashboard?page=1&section=${tab.id}`}
              prefetch="none"
              className={`text-lg tracking-wide underline ${
                getSection() === tab.id ? "font-bold" : ""
              }`}
            >
              {tab.label}
            </Link>
          </div>
        ))}
      </div>
      {tabs.map((tab) => {
        return (
          getSection() === tab.id && (
            <div key={tab.label}>
              {getSection() === 1 && (
                <AppUsersList
                  users={data.followings}
                  page={getPage()}
                  section={getSection()}
                />
              )}
              {getSection() === 2 && (
                <AppUsersList
                  users={data.followers}
                  page={getPage()}
                  section={getSection()}
                />
              )}
              <AppPaginator
                page={getPage()}
                section={getSection()}
                maxPerPage={getMaxUsersPerPage()}
              />
            </div>
          )
        );
      })}
    </div>
  );
}

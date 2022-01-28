import { createCookieSessionStorage } from "remix";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      // all of these are optional
      domain:
        process.env.NODE_ENV === "production"
          ? "followers-unfollowers-github.vercel.app"
          : "localhost",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });

export { getSession, commitSession, destroySession };

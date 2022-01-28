import { Form } from "remix";

export const AppUsersList: React.FC<{
  users: any[];
  page: number;
  section: number;
}> = ({ users, page, section }) => {
  return (
    <div>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <div
              className={`py-4 border-2 rounded-md flex justify-between items-center ${
                !user.isFollowingBack && user.isFollowingBack !== undefined
                  ? "bg-red-100"
                  : "bg-green-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar_url}
                  alt={`${user.login} avatar`}
                  className="w-16 rounded-full"
                />
                <div>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-blue-900"
                  >
                    {user.login}
                  </a>
                </div>
              </div>
              <div className="pr-10">
                {user.isFollowingBack && (
                  <Form method="delete">
                    <input type="hidden" name="user" value={user.login} />
                    <input type="hidden" name="page" value={page} />
                    <input type="hidden" name="section" value={section} />
                    <button type="submit">UnFollow</button>
                  </Form>
                )}
                {!user.isFollowingBack && (
                  <Form method="put">
                    <input type="hidden" name="user" value={user.login} />
                    <input type="hidden" name="page" value={page} />
                    <input type="hidden" name="section" value={section} />
                    <button type="submit">Follow</button>
                  </Form>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
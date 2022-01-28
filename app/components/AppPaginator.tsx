import { Link } from "remix";

export const AppPaginator: React.FC<{
  page: number;
  section: number;
  maxPerPage: number;
}> = ({ page, section, maxPerPage }) => {
  return (
    <div className="flex justify-between">
      <span>
        Page {page} of {maxPerPage}
      </span>
      <div className="flex gap-4">
        {page !== 1 && (
          <Link
            to={`/dashboard?page=${page - 1}&section=${section}`}
            prefetch="render"
          >
            Previous
          </Link>
        )}
        {page !== maxPerPage && (
          <Link
            to={`/dashboard?page=${page + 1}&section=${section}`}
            prefetch="render"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

import { Link } from "remix";

export const AppPaginator: React.FC<{
  page: number;
  section: number;
  maxPerPage: number;
}> = ({ page, section, maxPerPage }) => {
  return (
    <div className="flex justify-between items-end pt-5 px-10">
      <span className="font-semibold text-lg">
        Page {page} of {maxPerPage}
      </span>
      <div className="flex gap-4">
        {page !== 1 && (
          <Link
            to={`/dashboard?page=${page - 1}&section=${section}`}
            prefetch="render"
            className="button"
          >
            Previous
          </Link>
        )}
        {page !== maxPerPage && (
          <Link
            to={`/dashboard?page=${page + 1}&section=${section}`}
            prefetch="render"
            className="button"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

import clsx from "clsx";
import { FC } from "react";
import { Link, LinkProps } from "react-router-dom";

export const ButtonLink: FC<LinkProps> = (props) => {
  const { className, children, to, ...rest } = props;

  return (
    <Link
      to={to}
      role="button"
      className={clsx(className, "block w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto")}
      {...rest}
    >
      {children}
    </Link>
  )
}
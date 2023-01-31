import type { FC, ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type StyledLinkProps = Omit<LinkProps, "to"> & {
  children: ReactNode;
  href: string;
  isExternal?: boolean;
  className?: string;
};

export const StyledLink: FC<StyledLinkProps> = (props) => {
  const { children, href, isExternal = false, className } = props;
  const _className = "text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100";

  if (!isExternal) {
    return (
      <Link to={href} className={clsx(className, _className)}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_black"
      rel="noopener noreferrer"
      className={clsx(className, "inline-flex items-center", _className)}
    >
      {children}
      <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
    </a>
  );
};

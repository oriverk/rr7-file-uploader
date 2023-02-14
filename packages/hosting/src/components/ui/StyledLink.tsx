import type { FC, ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

type StyledLinkProps = Omit<LinkProps, "to"> & {
  children: ReactNode;
  href: string;
  isExternal?: boolean;
  className?: string;
};

export const StyledLink: FC<StyledLinkProps> = (props) => {
  const { children, href, isExternal = false, className } = props;

  if (!isExternal) {
    return (
      <Link to={href} className={twMerge("text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100", className)}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_black"
      rel="noopener noreferrer"
      className={twMerge("inline-flex items-center", "text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100", className)}
    >
      {children}
      <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
    </a>
  );
};

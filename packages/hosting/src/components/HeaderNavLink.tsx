import { FC, ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface IHeaderNavLink extends NavLinkProps {
  children: ReactNode;
  to: string;
  isExternal?: boolean;
  className?: string;
}

export const HeaderNavLink: FC<IHeaderNavLink> = (props) => {
  const { children, to, isExternal = false, className = "" } = props;
  const _className = twMerge(
    "text-base md:text-xl font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700",
    className
  );

  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={_className}>
        {children}
      </a>
    );
  }

  const active = (isActive: boolean) => (isActive ? "text-indigo-500" : "text-gray-600");

  return (
    <NavLink to={to} className={({ isActive }) => `${active(isActive)} ${_className}`}>
      {children}
    </NavLink>
  );
};
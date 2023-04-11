import { FC, ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import urlJoin from "url-join";

const IxanaryPath = import.meta.env.VITE_IXANARY_PATH;

interface IHeaderNavLink extends NavLinkProps {
  children: ReactNode;
  to: string;
  isExternal?: boolean;
  className?: string;
}
const HeaderNavLink: FC<IHeaderNavLink> = (props) => {
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

export const Header: FC = () => (
  <header className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row md:py-8">
    <NavLink to="" className="text-black-800 inline-flex items-center gap-2.5 text-2xl font-bold md:text-3xl">
      <span className="sr-only">Home</span>
      👆&nbsp;Uploader
    </NavLink>
    <nav className="flex gap-12">
      <HeaderNavLink to={IxanaryPath} isExternal className=" ">
        ⚔&nbsp;
        <span className="bg-gradient-to-r from-[#a3620c] via-[#eedb95] to-[#DAAF08] bg-clip-text text-transparent hover:from-[#DAAF08] hover:to-[#a3620c]">
          IXAnary
        </span>
      </HeaderNavLink>
      <HeaderNavLink to="files">Files</HeaderNavLink>
      <HeaderNavLink to="price">Pricing</HeaderNavLink>
      <HeaderNavLink to={urlJoin(IxanaryPath, "entry")} isExternal>
        Blog
      </HeaderNavLink>
    </nav>
  </header>
);

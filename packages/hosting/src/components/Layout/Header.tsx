/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import urlJoin from "url-join";

const IxanaryPath = import.meta.env.VITE_IXANARY_PATH

interface IHeaderNavLink extends NavLinkProps {
  children: ReactNode;
  to: string;
  isExternal?: boolean;
}
const HeaderNavLink: FC<IHeaderNavLink> = (props) => {
  const { children, to, isExternal = false } = props;

  if (isExternal) {
    return (
      <a
        href={to}
        target="_blank" rel="noopener noreferrer"
        className="text-gray-600 hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100"
      >
        {children}
      </a>
    )
  }
  const active = (isActive: boolean) => (isActive ? "text-indigo-500" : "text-gray-600");

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${active(isActive)} hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100`
      }
    >
      {children}
    </NavLink>
  );
};

export const Header: FC = () => (
  <header className="flex flex-col md:flex-row gap-4 justify-between items-center py-4 md:py-8">
    <NavLink
      to=""
      className="inline-flex items-center text-black-800 text-2xl md:text-3xl font-bold gap-2.5"
    >
      👆&nbsp;Uploader
    </NavLink>
    <nav className="flex gap-12">
      <HeaderNavLink to={IxanaryPath} isExternal>
        戦国IXAnary
      </HeaderNavLink>
      <HeaderNavLink to="files">Files</HeaderNavLink>
      <HeaderNavLink to="price">Pricing</HeaderNavLink>
      <HeaderNavLink to={urlJoin(IxanaryPath, "entry")} isExternal>
        Blog
      </HeaderNavLink>
    </nav>
  </header>
);

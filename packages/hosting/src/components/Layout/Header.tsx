import { FC, ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import urlJoin from "url-join";

const IxanaryPath = import.meta.env.VITE_IXANARY_PATH;

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
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700"
      >
        {children}
      </a>
    );
  }
  const active = (isActive: boolean) => (isActive ? "text-indigo-500" : "text-gray-600");

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${active(isActive)} text-lg font-semibold transition duration-100 hover:text-indigo-500 active:text-indigo-700`
      }
    >
      {children}
    </NavLink>
  );
};

export const Header: FC = () => (
  <header className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row md:py-8">
    <NavLink to="" className="text-black-800 inline-flex items-center gap-2.5 text-2xl font-bold md:text-3xl">
      👆&nbsp;Uploader
    </NavLink>
    <nav className="flex gap-12">
      <HeaderNavLink to={IxanaryPath} isExternal>
        IXAnary
      </HeaderNavLink>
      <HeaderNavLink to="files">Files</HeaderNavLink>
      <HeaderNavLink to="price">Pricing</HeaderNavLink>
      <HeaderNavLink to={urlJoin(IxanaryPath, "entry")} isExternal>
        Blog
      </HeaderNavLink>
    </nav>
  </header>
);

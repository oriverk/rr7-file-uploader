/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface IHeaderNavLink {
  children: ReactNode;
  to: string;
  isExternal?: boolean;
}
const HeaderNavLink: FC<IHeaderNavLink> = (props) => {
  const { children, to, isExternal = false } = props;
  const active = (isActive: boolean) => (isActive ? "text-indigo-500" : "text-gray-600");

  return (
    <NavLink
      to={to}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : ""}
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
      <HeaderNavLink to="">Home</HeaderNavLink>
      <HeaderNavLink to="files">Files</HeaderNavLink>
      <HeaderNavLink to="price">Pricing</HeaderNavLink>
      <HeaderNavLink to="blog">Blog</HeaderNavLink>
    </nav>
  </header>
);

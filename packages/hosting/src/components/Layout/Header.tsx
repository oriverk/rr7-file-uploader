/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom"
import { MenuAlt1Icon } from '@heroicons/react/outline'

interface IHeaderNavLink {
  children: ReactNode;
  to: string;
  isExternal?: boolean
}
const HeaderNavLink: FC<IHeaderNavLink> = (props) => {
  const { children, to, isExternal = false } = props
  const active = (isActive: boolean) =>
    isActive ? "text-indigo-500" : "text-gray-600"
  
  return (
    <NavLink
      to={to}
      target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : ""}
      className={({ isActive }) => `${active(isActive)} hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100`}
    >
      {children}
    </NavLink>
  )
}

export const Header: FC = () => (
  <header className="flex justify-between items-center py-4 md:py-8">
    <a
      href="/"
      className="inline-flex items-center text-black-800 text-2xl md:text-3xl font-bold gap-2.5"
      aria-label="logo"
    >
      Downloader
    </a>
    <nav className="hidden lg:flex gap-12">
      <HeaderNavLink to="">
        Home
      </HeaderNavLink>
      <HeaderNavLink to="files">
        Files
      </HeaderNavLink>
      <HeaderNavLink to="price">
        Pricing
      </HeaderNavLink>
      <HeaderNavLink to="blog">
        Blog
      </HeaderNavLink>
    </nav>
    <div className="flex gap-4">
      <a
        href="#"
        className="hidden lg:inline-block bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
      >
        Contact Sales
      </a>
      <button
        type="button"
        className="inline-flex items-center lg:hidden bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2"
      >
        <MenuAlt1Icon className="h-5 w-5" />
        Menu
      </button>
    </div>
  </header>
)

/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";
import { NavLink } from "react-router-dom"
import { Hamburger } from "../Icons";

export const Header: FC = () => {
  const active = (isActive: boolean) =>
    isActive ? "text-indigo-500" : "text-gray-600"
  
  return(
    <header className="flex justify-between items-center py-4 md:py-8 mb-4">
      <a
        href="/"
        className="inline-flex items-center text-black-800 text-2xl md:text-3xl font-bold gap-2.5"
        aria-label="logo"
      >
        {/* <IXAnary className="w-30 h-8" /> */}
        Downloader
      </a>
      <nav className="hidden lg:flex gap-12">
        <NavLink to="" className={`${active} hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100`}>
          Home
        </NavLink>
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100"
        >
          Features
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100"
        >
          About
        </a>
      </nav>
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
        <Hamburger className="h-6 w-6" />
        Menu
      </button>
    </header>
  )
}

import type { FC } from "react";
import { NavLink } from "react-router-dom";
import urlJoin from "url-join";
import { HeaderNavLink } from "../HeaderNavLink";

const IxanaryPath = import.meta.env.VITE_IXANARY_PATH;

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

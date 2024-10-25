import type { FC } from "react";
import { Link } from "@remix-run/react";

export const Header: FC = () => (
  <header className="navbar bg-base-100">
    <div className="flex-1">
      <Link to="" className="text-black-800 inline-flex items-center gap-2.5 text-2xl font-bold md:text-3xl">
        <span className="sr-only">Home</span>
        👆 Uploader
      </Link>
    </div>
    <nav className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li>
          <Link to="/ixanary">Files</Link>
        </li>
        <li>
          <Link to="/join">Join</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
    <div tabIndex={0} role="button" className="flex-none btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
      </div>
    </div>
  </header>
);

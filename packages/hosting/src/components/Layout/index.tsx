import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: FC = () => (
  <>
    <div className="bg-white max-w-screen-2xl px-4 md:px-8 mx-auto">
      <Header />
    </div>
    <Suspense>
      <Outlet />
    </Suspense>
    <Footer />
  </>
);

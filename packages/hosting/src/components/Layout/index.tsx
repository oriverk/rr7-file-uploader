import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { GoogleAnalytics, usePageView } from "@/utils/google/gtag";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Loading } from "../ui/Icons";

export const Layout: FC = () => {
  usePageView();
  return (
    <>
      <GoogleAnalytics />
      <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="max-w-screen-2xl px-4 md:px-8">
          <Header />
        </div>
        <div className="flex-1">
          <main>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

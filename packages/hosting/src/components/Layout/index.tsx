import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { Loading } from "../Icons"
import { Container } from "../Container";

const LoadingPage: FC = () => (
  <Container>
    <Loading />
  </Container>
)

export const Layout: FC = () => (
  <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div className="max-w-screen-2xl px-4 md:px-8">
      <Header />
    </div>
    <div className="flex-1">
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </div>
    <Footer />
  </div>
);

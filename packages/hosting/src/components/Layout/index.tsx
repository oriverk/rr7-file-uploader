import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { GoogleAnalytics, usePageView } from "@/utils/google/gtag";
import { useGoogleAdsense } from "@/utils/google/adsense";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Loading } from "../ui/Icons";
import { Container } from "../ui/Container";
import { CustomAdsense } from "@/components/Ads/AdSense";

const LoadingPage: FC = () => (
  <Container>
    <Loading />
  </Container>
);

export const Layout: FC = () => {
  usePageView();
  useGoogleAdsense();
  return (
    <>
      <GoogleAnalytics />
      <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="max-w-screen-2xl px-4 md:px-8">
          <Header />
        </div>
        <div className="flex-1">
          <CustomAdsense />
          <Suspense fallback={<LoadingPage />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
    </>
  );
};

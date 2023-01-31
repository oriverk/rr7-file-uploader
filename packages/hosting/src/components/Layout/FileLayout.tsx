import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../ui/Icons";
import { AdSense } from "@/components/ads/AdSense";

import { AmazonAffiliateBanners } from "../ads/AmazonAffiliate";
import { useGoogleAdsense } from "@/utils/google/adsense";
import { Container } from "../ui/Container";

export const FileLayout: FC = () => {
  useGoogleAdsense()
  return (
    <div className="flex flex-col gap-8 sm:flex-row justify-center">
      <aside className="py-2"><AmazonAffiliateBanners isKasane /></aside>
      <div className="w-full max-w-5xl">
        <Container>
          <AdSense className="responsiveDisplayAd" client={import.meta.env.VITE_PUBLISHER_ID} slot="3735361497" style={{ display: "block", textAlign: "center", border: "1px solid red" }} responsive />
        </Container>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
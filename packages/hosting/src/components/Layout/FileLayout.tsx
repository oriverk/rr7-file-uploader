import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from "../ui/Icons";
import { AdSense } from "@/components/ads/AdSense";

import { useGoogleAdsense } from "@/utils/google/adsense";
import { Container } from "../ui/Container";
import { ErrorFallback, handleErrorBounary } from "../ui/ErrorFallback";

export const FileLayout: FC = () => {
  useGoogleAdsense();
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="w-full max-w-5xl">
        <Container>
          <AdSense
            className="responsiveDisplayAd"
            client={import.meta.env.VITE_PUBLISHER_ID}
            slot="3735361497"
            style={{ display: "block", textAlign: "center" }}
            responsive
          />
        </Container>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleErrorBounary}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        <Container>
          <AdSense
            className="responsiveDisplayAd"
            client={import.meta.env.VITE_PUBLISHER_ID}
            slot="3735361497"
            style={{ display: "block", textAlign: "center" }}
            responsive
          />
        </Container>
      </div>
    </div>
  );
};

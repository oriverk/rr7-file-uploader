// reference: https://wp-kyoto.net/next-jsgoogle-adsense/
import { useEffect, useCallback } from "react";

const publisherId = import.meta.env.VITE_PUBLISHER_ID;

export const useGoogleAdsense = () => {
  if (!publisherId) return;

  const loadAd = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("adsense error", error.message);
      }
    }
  }, []);

  useEffect(() => {
    // adsbygoogle adsbygoogle-noablate
    const adsByGoogle = document.querySelectorAll(".adsbygoogle:not(.adsbygoogle-noablate)")
    Array.from(adsByGoogle).forEach(() => {
      loadAd()
    })
    // loadAd();
  }, []);
};

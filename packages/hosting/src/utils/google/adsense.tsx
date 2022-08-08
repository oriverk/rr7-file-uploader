// reference: https://wp-kyoto.net/next-jsgoogle-adsense/
import { useEffect, useCallback, FC } from "react";

const publisherId = import.meta.env.VITE_PUBLISHER_ID;

export const AdsByGoogle: FC = () => {
  if (!publisherId) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`}
      crossOrigin="anonymous"
    />
  );
};

export const useGoogleAdsense = () => {
  if (!publisherId) return;

  const loadAd = useCallback(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const component = window.document.getElementById("__next")?.querySelector(`.adsbygoogle`);
      if (component) {
        component.addEventListener("load", loadAd);
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        const component = window.document.getElementById("__next")?.querySelector(`.adsbygoogle`);
        if (component) {
          component.removeEventListener("load", loadAd);
        }
      }
    };
  }, [loadAd]);
};

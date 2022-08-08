/* eslint-disable react/no-danger */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// https://zenn.dev/kazuki23/articles/35f9227e5c45b2

// イベントを型で管理
type ContactEvent = {
  action: "submit_form";
  category: "contact";
};

type ClickEvent = {
  action: "click";
  category: "other";
};

export type Event = (ContactEvent | ClickEvent) & {
  label?: Record<string, string | number | boolean>;
  value?: string;
};

const Ga4TrackingId = import.meta.env.VITE_GA4_TRACKING_ID;

// IDが取得できない場合を想定する
export const existsGaId = !!Ga4TrackingId;

// _app.tsx で読み込む
export const usePageView = () => {
  const location = useLocation();
  if (!Ga4TrackingId) return;

  useEffect(() => {
    // Google Analytics 測定 ID を入力して設定
    ReactGA.initialize(Ga4TrackingId);
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
};

// _app.tsx で読み込む
export const GoogleAnalytics = () => {
  if (!Ga4TrackingId) return null;

  return (
    <>
      <script src={`https://www.googletagmanager.com/gtag/js?id=${Ga4TrackingId}`} />
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${Ga4TrackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

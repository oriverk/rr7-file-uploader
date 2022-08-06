import { FC, useEffect } from "react";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    adsbygoogle?: Array<unknown>
  }
}

const isDev = import.meta.env.DEV
const publisherId = import.meta.env.VITE_PUBLISHER_ID

export const AdSense: FC = () => {
  useEffect(() => {
    if (!isDev && publisherId) {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }, [])
  
  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`}
        crossOrigin="anonymous"
      />
      {/* <ins
        className="adsbygoogle"
        style={{ display: 'block', }}
        data-ad-client="ca-pub-3305972869013074"
        data-ad-slot="6566353638"
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
      {/* <ins className="adsbygoogle"
        style={{ display: 'block', }}
        data-ad-client="ca-pub-3305972869013074"
        data-ad-slot="3997134267"
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
      {/* <ins className="adsbygoogle"
        style={{ display: 'block', }}
        data-ad-client="ca-pub-3305972869013074"
        data-ad-slot="5238079650"
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
    </>
  )
}
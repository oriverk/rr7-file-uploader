import { FC } from "react";
import { Helmet } from "react-helmet-async";
import urlJoin from "url-join";

// import { AdSense } from "./AdSense"

interface Props {
  pathname?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

export const Seo: FC<Props> = (props) => {
  const { pathname = "", title = "", description = "", ogImage = "/assets/image/ogimage.jpg", noindex = false } = props;

  const isDev = import.meta.env.DEV;
  const origin = isDev ? "http://localhost:3000" : import.meta.env.VITE_SITE_PATH;

  const pageUrl = urlJoin(origin, pathname);
  const ogImageUrl = !ogImage.startsWith("http") ? urlJoin(origin, ogImage) : ogImage;
  const defaultTitle = "Uploader";
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={description || metaTitle} />
        <meta name="og:url" content={pageUrl} />
        <meta name="og:title" content={metaTitle} />
        <meta name="og:description" content={description || metaTitle} />
        <meta name="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="👆 Uploader" />
        <meta name="robots" content={noindex ? "noindex,nofollow" : "all"} />
        {/* <AdSense /> */}
      </Helmet>
      {/* <AdSense /> */}
    </>
  );
};

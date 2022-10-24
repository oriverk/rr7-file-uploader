import { FC } from "react";
import { Helmet } from "react-helmet-async";
import urlJoin from "url-join";
import { useRandomHeroImage } from "@/hooks/useRandomHeroImage";

// import { CustomAdsense } from "@/components/Ads/AdSense";

interface Props {
  pathname?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

export const Seo: FC<Props> = (props) => {
  const { pathname = "", title = "", description = "", ogImage, noindex = false } = props;
  const { url } = useRandomHeroImage(24);

  const isDev = import.meta.env.DEV;
  const origin = isDev ? "http://localhost:3000" : import.meta.env.VITE_SITE_PATH;

  const pageUrl = urlJoin(origin, pathname);
  // eslint-disable-next-line no-nested-ternary
  const ogImageUrl = !ogImage ? url : !ogImage.startsWith("http") ? urlJoin(origin, ogImage) : ogImage;
  const defaultTitle = "Uploader";
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={description || metaTitle} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={description || metaTitle} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="robots" content={noindex ? "noindex,nofollow" : "all"} />
      </Helmet>
      {/* <CustomAdsense /> */}
    </>
  );
};

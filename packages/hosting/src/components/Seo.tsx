import { FC } from "react";
import { Helmet } from "react-helmet-async";
import urlJoin from "url-join";
import { getCloudinaryImage } from "@/utils/getCloudinaryImage";

interface Props {
  pathname?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

const uploaderOG = getCloudinaryImage("ixanary/uploader-og.png")

export const Seo: FC<Props> = (props) => {
  const { pathname = "", title = "", description = "", ogImage, noindex = false } = props;

  const isDev = import.meta.env.DEV;
  const origin = isDev ? "http://localhost:3000" : import.meta.env.VITE_SITE_PATH;

  const pageUrl = urlJoin(origin, pathname);
  // eslint-disable-next-line no-nested-ternary
  const ogImageUrl = !ogImage ? uploaderOG : !ogImage.startsWith("http") ? urlJoin(origin, ogImage) : ogImage;
  const defaultTitle = "Uploader";
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  return (
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
  );
};

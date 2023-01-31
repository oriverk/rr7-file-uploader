/* eslint-disable arrow-body-style */
// ASIN と Amazon API を使って出来るようにしたい。そのうち。
import type { FC } from "react";
import { Banners } from "@/constants/banners";
// import { useMediaQuery } from 'react-responsive';

// const breakpoints = {
//   sm: '640px',
//   md: '768px',
//   lg: '1024px',
//   xl: '1280px',
//   '2xl': '1536px',
// };

type Props = {
  title?: string;
  href: string;
  src: string;
  src1: string;
};

export const AmazonAffiliateImage: FC<Props> = (props) => {
  const { href, src, src1, title } = props;
  if (!href || !src || !src1) return null;

  return (
    <div>
      <a href={href} title={title} target="_blank" rel="noopener noreferrer">
        <picture>
          <img src={src} alt="for amazon affiliate" className="mx-auto" />
        </picture>
      </a>
      <picture>
        <img src={src1} alt="not-display" className="hidden h-1 w-1" />
      </picture>
    </div>
  );
};

export type BannerProps = {
  title: string;
  src: string;
  width?: number;
  height?: number;
};

export const BannerLink: FC<BannerProps> = (props) => {
  const { title, src, width = 300, height = 250 } = props;
  return (
    <iframe
      title={title}
      src={src}
      width={width}
      height={height}
      style={{ border: "none", margin: 0 }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
    />
  );
};

interface BannersProps {
  isKasane?: boolean;
}

/**
 * 300x250 iframe banners in flex flex-col items-center gap-4
 * @param isKasane
 * @returns
 */
export const AmazonAffiliateBanners: FC<BannersProps> = ({ isKasane }) => (
  <div className="flex flex-col items-center gap-4">
    {isKasane && (
      <AmazonAffiliateImage
        title="Amazon - 戦國ストレイズ 7巻"
        href="https://www.amazon.co.jp/gp/product/B00CM10ALE?&linkCode=li3&tag=ixanary-22&linkId=4979670daa00e2e89c319eefdf82b13a&language=ja_JP&ref_=as_li_ss_il"
        src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00CM10ALE&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
        src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=B00CM10ALE"
      />
    )}
    {Banners.map(({title, ...rest}) => (
      <BannerLink {...rest} title={title} key={title} />
    ))}
  </div>
);

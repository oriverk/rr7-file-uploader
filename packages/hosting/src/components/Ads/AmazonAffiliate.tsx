// ASIN と Amazon API を使って出来るようにしたい。そのうち。
import type { FC } from 'react';
import { useMediaQuery } from 'react-responsive';

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

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

export const AmazonAffiliateKasane: FC = () => (
  <AmazonAffiliateImage
    title="Amazon - 戦國ストレイズ 7巻"
    href="https://www.amazon.co.jp/gp/product/B00CM10ALE?&linkCode=li3&tag=ixanary-22&linkId=4979670daa00e2e89c319eefdf82b13a&language=ja_JP&ref_=as_li_ss_il"
    src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00CM10ALE&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
    src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=B00CM10ALE"
  />
)

export const AmazonAffiliateNityouhin: FC = () => {
  const largerThanlg = useMediaQuery({ query: `(min-width: ${breakpoints.lg})` });
  if (largerThanlg) {
    return (
      <iframe
      title="日用品"
      src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=12&l=ur1&category=consumables&banner=01FFPGM6WNKYF9VQMHR2&f=ifr&linkID=e61f5160c998c1cc94dfb649483c7c43&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
      width="300" height="250"
      scrolling="no" frameBorder="0"
      style={{ border: "none", margin: 0 }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      />
    )
  }

  return (
    <iframe
      title="日用品"
      src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=21&l=ur1&category=consumables&banner=03RKAEY2YXPBTX9JE002&f=ifr&linkID=f8d44f2d0bcb13201cd9fca1ec679a52&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
      width="125" height="125" scrolling="no" frameBorder="0"
      style={{ border: "none", margin: 0 }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" />
  )
}

export const AmazonAffiliateCharge: FC = () => {
  const largerThanlg = useMediaQuery({ query: `(min-width: ${breakpoints.lg})` });
  if (largerThanlg) {
    return (
      <iframe
        title="charge"
        src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=12&l=ur1&category=gift_certificates&banner=1TJ8XM5YGJR5WC15P202&f=ifr&linkID=6fd35f43024385a68a48038d7a80785d&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
        width="300" height="250" scrolling="no" frameBorder="0"
        style={{ border: "none", margin: 0 }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      />
    )
  }
  return (
    <iframe
      title="charge"
      src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=21&l=ur1&category=gift_certificates&banner=0K2839167Y2W14T3QWG2&f=ifr&linkID=bbcef82e2ac5069497a6b89468a26ce7&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
      width="125" height="125" scrolling="no" frameBorder="0"
      style={{ border: "none", margin: 0 }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" />
  )
}

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
    {isKasane ? (<AmazonAffiliateKasane />) : null}
    <AmazonAffiliateNityouhin />
    <AmazonAffiliateCharge />
  </div>
)
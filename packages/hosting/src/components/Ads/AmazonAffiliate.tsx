/* eslint-disable arrow-body-style */
// ASIN と Amazon API を使って出来るようにしたい。そのうち。
import type { FC } from "react";
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

export const AmazonAffiliateKasane: FC = () => (
  <AmazonAffiliateImage
    title="Amazon - 戦國ストレイズ 7巻"
    href="https://www.amazon.co.jp/gp/product/B00CM10ALE?&linkCode=li3&tag=ixanary-22&linkId=4979670daa00e2e89c319eefdf82b13a&language=ja_JP&ref_=as_li_ss_il"
    src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00CM10ALE&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
    src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=B00CM10ALE"
  />
);

export const HunterHunterImage: FC = () => (
  <AmazonAffiliateImage
    title="Hunter X Hunter 最新37巻"
    href="https://www.amazon.co.jp/HUNTER%C3%97HUNTER-%E3%83%A2%E3%83%8E%E3%82%AF%E3%83%AD%E7%89%88-37-%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9DIGITAL-%E5%86%A8%E6%A8%AB%E7%BE%A9%E5%8D%9A-ebook/dp/B0BGLPGGFJ?_encoding=UTF8&qid=1667527522&sr=1-1&linkCode=li3&tag=ixanary-22&linkId=c4efd964ab2952312087aa7936a3e1f8&language=ja_JP&ref_=as_li_ss_il"
    src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BGLPGGFJ&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
    src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=B0BGLPGGFJ"
  />
);

export const OnePieceImage: FC = () => (
  <AmazonAffiliateImage
    title="ONE PIECE 104"
    href="https://www.amazon.co.jp/ONE-PIECE-104-%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9-%E6%A0%84%E4%B8%80%E9%83%8E/dp/4088832876?crid=1NQ2AAFAWS0B5&keywords=%E3%83%AF%E3%83%B3%E3%83%94%E3%83%BC%E3%82%B9+%E6%9C%80%E6%96%B0%E5%88%8A&qid=1667529723&qu=eyJxc2MiOiIyLjYyIiwicXNhIjoiMi4zOSIsInFzcCI6IjIuNDAifQ%3D%3D&sprefix=%E3%83%AF%E3%83%B3%E3%83%94%E3%83%BC%E3%82%B9%E3%80%80%E6%9C%80%E6%96%B0%2Caps%2C179&sr=8-2&linkCode=li3&tag=ixanary-22&linkId=ea95ec024b2176ec27ac7c5f3c944930&language=ja_JP&ref_=as_li_ss_il"
    src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4088832876&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
    src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=4088832876"
  />
);

export const PocketMonsterScarlet: FC = () => (
  // <a href="" target="_blank"><img border="0" src="" ></a><img src="" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  <AmazonAffiliateImage
    title="ポケットモンスター スカーレット - Switch"
    href="https://www.amazon.co.jp/%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC-%E3%82%B9%E3%82%AB%E3%83%BC%E3%83%AC%E3%83%83%E3%83%88-Switch-%E3%80%90%E6%97%A9%E6%9C%9F%E8%B3%BC%E5%85%A5%E7%89%B9%E5%85%B8%E3%80%91%E3%83%97%E3%83%AD%E3%83%A2%E3%82%AB%E3%83%BC%E3%83%89%E3%80%8C%E3%83%94%E3%82%AB%E3%83%81%E3%83%A5%E3%82%A6%E3%80%8D-%C3%971/dp/B09WZYJCWG?keywords=%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC+%E3%82%B9%E3%82%AB%E3%83%BC%E3%83%AC%E3%83%83%E3%83%88+%E3%83%90%E3%82%A4%E3%82%AA%E3%83%AC%E3%83%83%E3%83%88&qid=1668589413&qu=eyJxc2MiOiIzLjAwIiwicXNhIjoiMi41OCIsInFzcCI6IjIuMzcifQ%3D%3D&sprefix=%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC%2Caps%2C216&sr=8-5&linkCode=li3&tag=ixanary-22&linkId=40da0b8af67fe791e7efae4eb76143f9&language=ja_JP&ref_=as_li_ss_il"
    src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09WZYJCWG&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
    src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=4088832876"
  />
);

// vio

export const PocketMonsterViolet: FC = () => (
  // <a href="" target="_blank"><img border="0" src="" ></a><img src="" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  <AmazonAffiliateImage
    title="ポケットモンスター バイオレット - Switch"
    href="https://www.amazon.co.jp/%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC-%E3%83%90%E3%82%A4%E3%82%AA%E3%83%AC%E3%83%83%E3%83%88-Switch-%E3%80%90%E6%97%A9%E6%9C%9F%E8%B3%BC%E5%85%A5%E7%89%B9%E5%85%B8%E3%80%91%E3%83%97%E3%83%AD%E3%83%A2%E3%82%AB%E3%83%BC%E3%83%89%E3%80%8C%E3%83%94%E3%82%AB%E3%83%81%E3%83%A5%E3%82%A6%E3%80%8D-%E3%80%90Amazon-co-jp%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E7%89%B9%E5%85%B8%E3%80%91%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E3%83%AA%E3%83%A5%E3%83%83%E3%82%AF/dp/B09X17GBLT?keywords=%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC%2B%E3%82%B9%E3%82%AB%E3%83%BC%E3%83%AC%E3%83%83%E3%83%88%2B%E3%83%90%E3%82%A4%E3%82%AA%E3%83%AC%E3%83%83%E3%83%88&qid=1668589413&qu=eyJxc2MiOiIzLjAwIiwicXNhIjoiMi41OCIsInFzcCI6IjIuMzcifQ%3D%3D&sprefix=%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC%2Caps%2C216&sr=8-6&th=1&linkCode=li3&tag=ixanary-22&linkId=d8b1e9e74900c6426fe6adf0523365b4&language=ja_JP&ref_=as_li_ss_il"
    src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09X17GBLT&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=ixanary-22&language=ja_JP"
    src1="https://ir-jp.amazon-adsystem.com/e/ir?t=ixanary-22&language=ja_JP&l=li3&o=9&a=B09X17GBLT"
  />
);

export type BannerProps = {
  title: string;
  src: string;
  width: number;
  height: number;
};
export const BannerLink: FC<BannerProps> = (props) => {
  const { title, src, width, height } = props;
  return (
    <iframe
      title={title}
      src={src}
      width={width.toString()}
      height={height.toString()}
      scrolling="no"
      frameBorder="0"
      style={{ border: "none", margin: 0 }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
    />
  );
};

export const NitiyouhinBanner: FC = () => (
  <BannerLink
    title="日用品"
    src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=12&l=ur1&category=consumables&banner=01FFPGM6WNKYF9VQMHR2&f=ifr&linkID=e61f5160c998c1cc94dfb649483c7c43&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
    width={300}
    height={250}
  />
);

export const ChargeBanner: FC = () => (
  <BannerLink
    title="charge"
    src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=12&l=ur1&category=gift_certificates&banner=1TJ8XM5YGJR5WC15P202&f=ifr&linkID=6fd35f43024385a68a48038d7a80785d&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
    width={300}
    height={250}
  />
);

export const TimeSaleBanner: FC = () => {
  return (
    <BannerLink
      title="AmazonTimeSale"
      src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=12&l=ur1&category=blackfriday&banner=0KXBJKTD7WQ6NREAZ002&f=ifr&linkID=bf2fe05f5e3d8d33e3bb02b71b7215f5&t=ixanary-uploader-22&tracking_id=ixanary-uploader-22"
      width={300}
      height={250}
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
    {isKasane ? <AmazonAffiliateKasane /> : null}
    <TimeSaleBanner />
    <NitiyouhinBanner />
    <ChargeBanner />
  </div>
);

import clsx from "clsx";
import { FC, CSSProperties } from "react";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    adsbygoogle?: Array<unknown>;
  }
}

interface Props {
  className?: string;
  client: string;
  slot: string;
  style?: CSSProperties;
  layout?: string;
  format?: string;
  responsive?: boolean;
}

/**
 * @param props
 * client: /^pub-\d+$/
 * @returns
 */
export const AdSense: FC<Props> = (props) => {
  const {
    className = "",
    client,
    slot,
    style = { display: "block" },
    layout = "",
    format = "auto",
    responsive = false,
  } = props;
  if (!client) return null;

  // useEffect(() => {
  //   if (client) {
  //     if (window) {
  //       (window.adsbygoogle = window.adsbygoogle || []).push({});
  //     }
  //   }
  // }, []);

  return (
    <ins
      className={clsx(className, "adsbygoogle")}
      style={style}
      data-ad-client={`ca-${client}`}
      data-ad-slot={slot}
      data-ad-layout={layout}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

const publisherId = import.meta.env.VITE_PUBLISHER_ID;
export const CustomAdsense: FC = () => (
  <AdSense client={publisherId} slot="3735361497" style={{ display: "block", textAlign: "center" }} responsive />
);

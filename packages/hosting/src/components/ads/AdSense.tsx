import clsx from "clsx";
import { FC, CSSProperties } from "react";

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
  const isDev = import.meta.env.DEV;

  return (
    <ins
      className={clsx(className, "adsbygoogle", isDev && "border border-red-500")}
      style={style}
      data-ad-client={`ca-${client}`}
      data-ad-slot={slot}
      data-ad-layout={layout}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

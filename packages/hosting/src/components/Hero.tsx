/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";

import { getCloudinaryImage } from "@/utils/getCloudinaryImage";
import { useRandomHeroImage } from "@/hooks/useRandomHeroImage";

export const GameStart: FC = () => {
  const startImgUrl = getCloudinaryImage(`ixanary/game-start.webp`);
  return (
    <div className="group relative h-[248px] w-[238px]">
      <a
        href="https://sengokuixa.jp/"
        title="Yahoo! JAPAN IDをお持ちでない方もこちら　登録は5秒でOK！　ゲームスタート"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={startImgUrl}
          alt="Yahoo! JAPAN IDをお持ちでない方もこちら　登録は5秒でOK！　ゲームスタート"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top group-hover:object-bottom"
        />
      </a>
    </div>
  );
};

export const Hero: FC = () => {
  const { name, url } = useRandomHeroImage(24);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-1 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
      <picture>
        <img
          src={url}
          loading="lazy"
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-left-top"
        />
      </picture>
      <div className="absolute inset-0 bg-gray-200 mix-blend-multiply" />
      <div className="absolute bottom-2 p-4 md:bottom-12 md:right-16">
        <GameStart />
      </div>
    </section>
  );
};

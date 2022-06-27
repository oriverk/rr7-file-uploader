/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";

import { getCloudinaryImage } from "../utils/getCloudinaryImage";
import { useRandomHeroImage } from "../hooks/useRandomHeroImage";

export const GameStart: FC = () => {
  const startImgUrl = getCloudinaryImage(`ixanary/game-start.webp`)
  return (
    // eslint-disable-next-line react/style-prop-object
    <div className="relative group" style={{ width: '238px', height: '248px' }}>
      <a href="https://sengokuixa.jp/"
        title="Yahoo! JAPAN IDをお持ちでない方もこちら　登録は5秒でOK！　ゲームスタート"
        target="_blank" rel="noopener noreferrer"
      >
        <img
          src={startImgUrl}
          alt="Yahoo! JAPAN IDをお持ちでない方もこちら　登録は5秒でOK！　ゲームスタート"
          loading="lazy"
          className="w-full h-full object-cover object-top absolute inset-0 group-hover:object-bottom"
        />
      </a>
    </div>
  )
}

export const Hero: FC = () => {
  const { name, url } = useRandomHeroImage(23)
  
  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex justify-center items-center flex-1 shrink-0 bg-gray-100 overflow-hidden shadow-lg rounded relative py-16 md:py-20 xl:py-48">
      <img
        src={url}
        loading="lazy"
        alt={name}
        className="w-full h-full object-cover object-left-top absolute inset-0"
      />
      <div className="bg-gray-200 mix-blend-multiply absolute inset-0" />
      <div className="p-4 absolute bottom-2 md:bottom-12 md:right-16">
        <GameStart />
      </div>
    </section>
  );
}

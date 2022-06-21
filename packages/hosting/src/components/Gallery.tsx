/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";
import { useRandomHeroImage } from "../hooks/useRandomHeroImage";

type ContentProps = {
  href: string;
  imgSrc: string;
  imgAlt: string;
  text: string;
  isExternal?: boolean
}

const GridConetnt: FC<ContentProps> = ({ href, imgSrc, imgAlt, text, isExternal = false }) => (
  <a
    href={href}
    target={isExternal ? "_black" : "_self"} rel={isExternal ? "noopener noreferrer" : ""}
    className="group h-48 md:h-80 flex items-end bg-gray-100 overflow-hidden rounded-lg shadow-lg relative"
  >
    <img
      src={imgSrc}
      loading="lazy"
      alt={imgAlt}
      className="w-full h-full object-cover object-center absolute inset-0 group-hover:scale-110 transition duration-200"
    />

    <div className="bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50 absolute inset-0 pointer-events-none" />
    <span className="inline-block text-white text-sm md:text-lg relative ml-4 md:ml-5 mb-3">
      {text}
    </span>
  </a>
)

export const Gallery: FC = () => {
  const { name, url } = useRandomHeroImage(23)

  return (
    <>
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8 xl:mb-12">
        IXAnary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 mb-4 md:mb-8">
        <GridConetnt
          href="https://ixanary.com"
          imgSrc={url}
          imgAlt={name}
          text="Top"
          isExternal
        />
        <GridConetnt
          href="https://ixanary.com/albums/"
          imgSrc="./assets/image/album.webp"
          imgAlt="武将カードアルバム"
          text="Album"
          isExternal
        />
        <GridConetnt
          href="https://ixanary.com/tools/gousei-sozai-kensaku/"
          imgSrc="./assets/image/search.webp"
          imgAlt="追加合成素材検索"
          text="Search Skills"
        />
        <GridConetnt
          href="https://ixanary.com/entry/"
          imgSrc="./assets/image/posts.webp"
          imgAlt="投稿一覧"
          text="Posts"
        />
      </div>
    </>
  )
}

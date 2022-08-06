/* eslint-disable jsx-a11y/anchor-is-valid */
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { FC } from "react";
import { Link } from "react-router-dom";
import urlJoin from "url-join";
import { useRandomHeroImage } from "../hooks/useRandomHeroImage";

type ContentProps = {
  href: string;
  imgSrc: string;
  imgAlt: string;
  text: string;
  isExternal?: boolean;
};

const Content: FC<Pick<ContentProps, "imgSrc" | "imgAlt">> = ({ imgSrc, imgAlt }) => (
  <>
    <picture>
      <img
        src={imgSrc}
        loading="lazy"
        alt={imgAlt}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
      />
    </picture>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50" />
  </>
);

export const GridConetnt: FC<ContentProps> = ({ href, imgSrc, imgAlt, text, isExternal = false }) => {
  

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
      >
        <Content imgSrc={imgSrc} imgAlt={imgAlt} />
        <p className="relative ml-4 mb-3 flex items-center text-sm text-white md:ml-5 md:text-lg">
          {text}
          <ExternalLinkIcon className="ml-1 h-4 w-4 text-white" />
        </p>
      </a>
    );
  }
  return (
    <Link to={href}>
      <a className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
        <Content imgSrc={imgSrc} imgAlt={imgAlt} />
        <p className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">{text}</p>
      </a>
    </Link>
  );
};

const ixanaryPath = import.meta.env.VITE_IXANARY_PATH

export const Gallery: FC = () => {
  const { name, url } = useRandomHeroImage(24);

  return (
    <>
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8 xl:mb-12">IXAnary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 mb-4 md:mb-8">
        <GridConetnt
          href={ixanaryPath}
          imgSrc={url}
          imgAlt={name}
          text="Top"
          isExternal
        />
        <GridConetnt
          href={urlJoin(ixanaryPath, "albums")}
          imgSrc="./assets/image/album.webp"
          imgAlt="武将カードアルバム"
          text="Album"
          isExternal
        />
        <GridConetnt
          href={urlJoin(ixanaryPath, "tools/gousei-sozai-kensaku")}
          imgSrc="./assets/image/search.webp"
          imgAlt="追加合成素材検索"
          text="Search Skills"
          isExternal
        />
        <GridConetnt
          href={urlJoin(ixanaryPath, "entry")}
          imgSrc="./assets/image/posts.webp"
          imgAlt="投稿一覧"
          text="Posts"
          isExternal
        />
      </div>
    </>
  );
};

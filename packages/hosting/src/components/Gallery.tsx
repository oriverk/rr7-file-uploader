import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { Link } from "react-router-dom";
import urlJoin from "url-join";
import { useRandomHeroImage } from "@/hooks/useRandomHeroImage";

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
        <p className="relative mb-3 ml-4 flex items-center text-sm text-white md:ml-5 md:text-lg">
          {text}
          <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4 text-white" />
        </p>
      </a>
    );
  }
  return (
    <Link
      to={href}
      className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
    >
      <Content imgSrc={imgSrc} imgAlt={imgAlt} />
      <p className="relative mb-3 ml-4 inline-block text-sm text-white md:ml-5 md:text-lg">{text}</p>
    </Link>
  );
};

const ixanaryPath = import.meta.env.VITE_IXANARY_PATH;

export const Gallery: FC = () => {
  const { name, url } = useRandomHeroImage();

  return (
    <>
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl xl:mb-12">IXAnary</h2>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-4 xl:gap-8">
        <GridConetnt href={ixanaryPath} imgSrc={url} imgAlt={name} text="戦国IXAnary" isExternal />
        <GridConetnt
          href={urlJoin(ixanaryPath, "albums")}
          imgSrc="./assets/image/album.webp"
          imgAlt="武将カードアルバム"
          text="Album"
          isExternal
        />
        <GridConetnt
          href={urlJoin(ixanaryPath, "search")}
          imgSrc="./assets/image/search.webp"
          imgAlt="IXAnary検索"
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

/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { Link } from 'react-router-dom';

import { Container } from '../components/Container'
import { useRandomHeroImage } from '../hooks/useRandomHeroImage';

interface ICardContent {
  dateString: string;
  title: string;
  imgSrc?: string;
  imgAlt?: string;
}

const CardContent: FC<ICardContent> = (props) => {
  const { name, url: imgUrl } = useRandomHeroImage(23)
  const { dateString, title, imgSrc = imgUrl, imgAlt = name } = props
  
  return (
    <div className="group h-48 md:h-64 xl:h-96 flex flex-col bg-gray-100 rounded-lg shadow-lg overflow-hidden relative">
      <img
        src={imgSrc}
        loading="lazy"
        alt={imgAlt}
        className="w-full h-full object-cover object-center absolute inset-0 group-hover:scale-110 transition duration-200"
      />
      <div className="bg-gradient-to-t from-gray-800 md:via-transparent to-transparent absolute inset-0 pointer-events-none" />
      <div className="relative p-4 mt-auto">
        <span className="block text-gray-200 text-sm">
          <time dateTime={dateString}>{dateString}</time>
        </span>
        <h2 className="text-white text-xl font-semibold transition duration-100 mb-2">
          {title}
        </h2>
        <span className="text-indigo-300 font-semibold">
          Read more
        </span>
      </div>
    </div>
  )
}

export const Blog: FC = () => (
  <Container>
    <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <div className="mb-10 md:mb-16">
        <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">
          Blog
        </h2>
        <p className="max-w-screen-md text-gray-500 md:text-lg text-center mx-auto">
          This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
        <a href="https://ixanary.com/entry/" target="_blank" rel="noopener noreferrer">
          <CardContent dateString='2022-06-27' title="戦国IXAnary投稿 一覧" />
        </a>
        <a href="https://ixanary.com/entry/skill-search-extension/" target="_blank" rel="noopener noreferrer">
          <CardContent
            dateString='2022-06-01'
            title="武将スキル検索のための拡張機能を作りました。"
            imgSrc="https://i.gyazo.com/71ac5b83fbd35a67c2d0030d0613a8af.png"
            imgAlt="from gyazo"
          />
        </a>
        <a href="https://ixanary.com/entry/skill-search-extension/" target="_blank" rel="noopener noreferrer">
          <CardContent
            dateString='2022-04-08'
            title="加勢部隊スキルを分類表示する拡張機能 Reinforce Skill Inspector のすゝめ"
            imgSrc="https://res.cloudinary.com/di5dy6sdj/image/upload/v1648763302/ixanary/blog/202204-reinforce-skill-inspector.webp"
            imgAlt="from cloudinary"
          />
        </a>
        <a href="https://ixanary.com/entry/en-skill-search-extension/" target="_blank" rel="noopener noreferrer">
          <CardContent
            dateString='2022-04-08'
            title="Why not reinforce skill inspector extension?"
            imgSrc="https://res.cloudinary.com/di5dy6sdj/image/upload/v1648763302/ixanary/blog/202204-reinforce-skill-inspector.webp"
            imgAlt="from cloudinary"
          />
        </a>
        <Link to="/privacy">
          <CardContent dateString='2022-06-27' title="プライバシーポリシー" />
        </Link>
        <Link to="/terms">
          <CardContent dateString='2022-06-27' title="利用規約" />
        </Link>
      </div>
    </div>
  </Container>
)
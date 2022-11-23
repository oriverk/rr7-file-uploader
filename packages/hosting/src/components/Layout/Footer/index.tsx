/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import urlJoin from "url-join";
import { IXAnary } from "../../Icons";
import { CopyRight } from "./Copyright";
import { SocialLinks } from "./SocialLinks";

type StyledLinkProps = {
  children: ReactNode;
  href: string;
  isExternal?: boolean;
};

const StyledLink: FC<StyledLinkProps> = (props) => {
  const { children, href, isExternal = false } = props;
  const className = "text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100";

  if (!isExternal) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_black" rel="noopener noreferrer" className={clsx(className, "flex items-center")}>
      {children}
      <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
    </a>
  );
};

const ixanaryPath = import.meta.env.VITE_IXANARY_PATH;

export const Footer: FC = () => (
  <footer className="bg-white">
    <div className="pt-12 lg:pt-16">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6 lg:gap-8">
          <div className="col-span-full lg:col-span-2">
            <div className="mb-4 lg:-mt-2">
              <a href="/" className="flex items-center gap-2.5 text-2xl" aria-label="logo">
                <span>⚔</span>
                <IXAnary className="w-30 h-8" />
              </a>
            </div>
            <p className="mb-6 text-gray-500 sm:pr-8">
              Quo usque tandem abutere, Catilina, patientia nostra? Quam diu etiam furor iste tuus nos eludet?
            </p>
            <SocialLinks />
          </div>
          <div>
            <div className="mb-4 font-bold tracking-widest text-gray-800">IXAnary</div>
            <nav className="flex flex-col gap-4">
              <div>
                <StyledLink href={ixanaryPath} isExternal>
                  トップ
                </StyledLink>
              </div>
              <div>
                <StyledLink href={urlJoin(ixanaryPath, "tools/gousei-sozai-kensaku")} isExternal>
                  追加合成素材検索
                </StyledLink>
              </div>
              <div>
                <StyledLink href={urlJoin(ixanaryPath, "entry")} isExternal>
                  投稿一覧
                </StyledLink>
              </div>
              <div>
                <StyledLink href={urlJoin(ixanaryPath, "albums")} isExternal>
                  カードアルバム
                </StyledLink>
              </div>
            </nav>
          </div>
          <div>
            <div className="mb-4 font-bold tracking-widest text-gray-800">Platforms</div>
            <nav className="flex flex-col gap-4">
              <div>
                <StyledLink href="https://sengokuixa.jp/" isExternal>
                  Yahoo!ゲーム
                </StyledLink>
              </div>
              <div>
                <StyledLink href="https://d.sengokuixa.jp/top" isExternal>
                  DMM GAMES
                </StyledLink>
              </div>
              <div>
                <StyledLink href="https://m.sengokuixa.jp/top" isExternal>
                  mixiゲーム
                </StyledLink>
              </div>
              <div>
                <StyledLink href="https://g.sengokuixa.jp/top" isExternal>
                  my GAMECITY
                </StyledLink>
              </div>
              <div>
                <StyledLink href="http://sengokuixa.hange.jp/" isExternal>
                  hange
                </StyledLink>
              </div>
              <div>
                <StyledLink href="https://gesoten.com/games/genre/battle-simulation/IXA" isExternal>
                  ゲソてん
                </StyledLink>
              </div>
            </nav>
          </div>
          <div>
            <div className="mb-4 font-bold tracking-widest text-gray-800">Links</div>
            <nav className="flex flex-col gap-4">
              <div>
                <StyledLink href="https://world.sengokuixa.jp/help/ixa_help.php?ch=1&s=23" isExternal>
                  戦国IXA ヘルプ
                </StyledLink>
              </div>
              <div>
                <StyledLink href="https://twitter.com/noroshi_ixa" isExternal>
                  応援のろし
                </StyledLink>
              </div>
              <div>
                <StyledLink href="https://twitter.com/IxaPr" isExternal>
                  戦国IXA_PR
                </StyledLink>
              </div>
              <div>
                <StyledLink href="http://www.ixawiki.com/index.php?FrontPage" isExternal>
                  戦国IXA wiki
                </StyledLink>
              </div>
            </nav>
          </div>
          <div>
            <div className="mb-4 font-bold tracking-widest text-gray-800">Legal</div>
            <nav className="flex flex-col gap-4">
              <div>
                <StyledLink href="/lorem">lorem ipsum</StyledLink>
              </div>
              <div>
                <StyledLink href="/terms">利用規約</StyledLink>
              </div>
              <div>
                <StyledLink href="/privacy">プライバシーポリシー</StyledLink>
              </div>
              {/* <div>
                <Link href="#">
                  Cookie settings
                </Link>
              </div> */}
            </nav>
          </div>
        </div>
        <CopyRight />
      </div>
    </div>
  </footer>
);

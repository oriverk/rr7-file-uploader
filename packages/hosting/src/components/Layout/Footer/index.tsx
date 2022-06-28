/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, ReactNode } from "react";
import { IXAnary } from "../../Icons/IXAnary";
import { CopyRight } from "./Copyright";
import { SocialLinks } from "./SocialLinks";

type LinkProps = {
  children: ReactNode;
  href: string;
  isExternal?: boolean;
};
const Link: FC<LinkProps> = ({ children, href, isExternal = false }) => (
  <a
    href={href}
    target={isExternal ? "_black" : "_self"}
    rel={isExternal ? "noopener noreferrer" : ""}
    className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
  >
    {children}
  </a>
);

export const Footer: FC = () => (
  <footer className="bg-white">
    <div className="pt-12 lg:pt-16">
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          <div className="col-span-full lg:col-span-2">
            <div className="lg:-mt-2 mb-4">
              <a href="/" className="" aria-label="logo">
                <IXAnary className="w-30 h-8" />
              </a>
            </div>
            <p className="text-gray-500 sm:pr-8 mb-6">
              Filler text is dummy text which has no meaning however looks very similar to real text
            </p>
            <SocialLinks />
          </div>
          <div>
            <div className="text-gray-800 font-bold tracking-widest mb-4">IXAnary</div>
            <nav className="flex flex-col gap-4">
              <div>
                <Link href="https://ixanary.com/" isExternal>
                  トップ
                </Link>
              </div>
              <div>
                <Link href="https://ixanary.com/tools/gousei-sozai-kensaku/" isExternal>
                  追加合成素材検索
                </Link>
              </div>
              <div>
                <Link href="https://ixanary.com/entry/" isExternal>
                  投稿一覧
                </Link>
              </div>
              <div>
                <Link href="https://ixanary.com/albums/" isExternal>
                  カードアルバム
                </Link>
              </div>
            </nav>
          </div>
          <div>
            <div className="text-gray-800 font-bold tracking-widest mb-4">Platforms</div>
            <nav className="flex flex-col gap-4">
              <div>
                <Link href="https://sengokuixa.jp/" isExternal>
                  Yahoo!ゲーム
                </Link>
              </div>
              <div>
                <Link href="https://d.sengokuixa.jp/top" isExternal>
                  DMM GAMES
                </Link>
              </div>
              <div>
                <Link href="https://m.sengokuixa.jp/top" isExternal>
                  mixiゲーム
                </Link>
              </div>
              <div>
                <Link href="https://g.sengokuixa.jp/top" isExternal>
                  my GAMECITY
                </Link>
              </div>
              <div>
                <Link href="http://sengokuixa.hange.jp/" isExternal>
                  hange
                </Link>
              </div>
              <div>
                <Link href="https://gesoten.com/games/genre/battle-simulation/IXA" isExternal>
                  ゲソてん
                </Link>
              </div>
            </nav>
          </div>
          <div>
            <div className="text-gray-800 font-bold tracking-widest mb-4">Links</div>
            <nav className="flex flex-col gap-4">
              <div>
                <Link href="https://world.sengokuixa.jp/help/ixa_help.php?ch=1&s=23" isExternal>
                  戦国IXA ヘルプ
                </Link>
              </div>
              <div>
                <Link href="https://twitter.com/noroshi_ixa" isExternal>
                  戦国IXA応援のろし
                </Link>
              </div>
              <div>
                <Link href="https://twitter.com/IxaPr" isExternal>
                  戦国IXA_PR
                </Link>
              </div>
              <div>
                <Link href="http://www.ixawiki.com/index.php?FrontPage" isExternal>
                  戦国IXA wiki
                </Link>
              </div>
            </nav>
          </div>
          <div>
            <div className="text-gray-800 font-bold tracking-widest mb-4">Legal</div>
            <nav className="flex flex-col gap-4">
              <div>
                <Link href="/terms">利用規約</Link>
              </div>
              <div>
                <Link href="/privacy">プライバシーポリシー</Link>
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

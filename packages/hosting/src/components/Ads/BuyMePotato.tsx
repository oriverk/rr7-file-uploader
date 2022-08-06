import { FC } from "react";
import { Potato } from "../Icons"

export const BuyMePotato: FC = () => {
  const url = "https://www.amazon.co.jp/hz/wishlist/ls/10OQ35MBI8WSF?ref_=wl_share"
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" role="button">
      <div className="py-1 px-2 flex items-center justify-center rounded-md bg-[#ffa41c] hover:bg-[#fa8900] transition-colors delay-50 duration-75 ease-out text-white font-bold">
        <Potato className="w-7 h-7 mr-2" />
        BuyMePotato
      </div>
    </a>
  )
}
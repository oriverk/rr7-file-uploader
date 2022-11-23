import { FC } from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Potato } from "../Icons";

export const BuyMePotato: FC = () => {
  const url = import.meta.env.VITE_AMAZON_WISHLIST || "";
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" role="button">
      <div className="delay-50 flex items-center justify-center gap-2 rounded-md bg-[#ffa41c] py-1 px-2 font-bold text-white transition-colors duration-75 ease-out hover:bg-[#fa8900]">
        <Potato className="h-7 w-7" />
        中の人が読みたい技術書
        <BookOpenIcon className="h-6 w-6 text-slate-50" />
      </div>
    </a>
  );
};

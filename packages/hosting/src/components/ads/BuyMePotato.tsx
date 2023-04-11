import { FC } from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Potato } from "../ui/Icons";

export const BuyMePotato: FC<{ text?: string }> = ({ text = "Amazon干し芋リスト" }) => {
  const url = import.meta.env.VITE_AMAZON_WISHLIST || "";
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" role="button">
      <div className="delay-50 flex items-center justify-center gap-2 rounded-md bg-[#ffa41c] px-2 py-1 font-bold text-white transition-colors duration-75 ease-out hover:bg-[#fa8900]">
        <Potato className="h-7 w-7" />
        {text}
        <BookOpenIcon className="h-6 w-6 text-slate-50" />
      </div>
    </a>
  );
};

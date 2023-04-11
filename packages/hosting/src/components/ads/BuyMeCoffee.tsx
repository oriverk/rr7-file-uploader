import type { FC } from "react";
import { Coffee } from "../ui/Icons";

export const BuyMeCoffeeButton: FC = () => (
  <a href="https://www.buymeacoffee.com/ixanary" target="_blank" rel="noopener noreferrer">
    <picture>
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        className="mx-auto h-[60px] w-[217px]"
      />
    </picture>
  </a>
);

export const BuyMeCoffee: FC = () => (
  <a href="https://www.buymeacoffee.com/ixanary" target="_blank" rel="noopener noreferrer" role="button">
    <div className="delay-50 flex items-center justify-center rounded-md bg-[#fd0] px-2 py-1 font-bold text-black transition-colors duration-75 ease-out hover:bg-[#f7d501]">
      <Coffee className="mr-1 h-7 w-7" />
      BuyMeCoffee
    </div>
  </a>
);

import type { FC } from 'react';
import { Coffee } from "../Icons"

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
    <div className="py-1 px-2 flex items-center justify-center rounded-md bg-[#fd0] hover:bg-[#f7d501] transition-colors delay-50 duration-75 ease-out text-black font-bold">
      <Coffee className="w-7 h-7 mr-1" />
      BuyMeCoffee
    </div>
  </a>
)
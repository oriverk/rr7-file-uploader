/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";

export const HelpCenter: FC = () => (
  <div className="md:h-80 flex flex-col sm:flex-row bg-gray-200 rounded-lg overflow-hidden">
    <div className="w-full sm:w-1/2 lg:w-2/5 h-48 sm:h-auto order-first sm:order-none bg-gray-300">
      <img
        src="./assets/image/sengoku-hasha.webp"
        loading="lazy"
        alt="戦場を制覇し、戦国の覇者となれ！"
        className="w-full h-full object-cover object-center"
      />
    </div>
    <div className="w-full sm:w-1/2 lg:w-3/5 flex flex-col p-4 sm:p-8">
      <h2 className="text-gray-800 text-xl md:text-2xl lg:text-4xl font-bold mb-4">
        Help center
      </h2>
      <p className="max-w-md text-gray-600 mb-8">
        Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
      </p>
      <div className="mt-auto mx-auto sm:ml-0">
        <a
          href="https://twitter.com/IXAnary"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block bg-white hover:bg-gray-100 active:bg-gray-200 focus-visible:ring ring-indigo-300 text-gray-800 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
        >
          Contact support (Twitter@IXAnary)
        </a>
      </div>
    </div>
  </div>
);

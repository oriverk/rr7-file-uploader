import { FC } from "react";

export const HelpCenter: FC = () => (
  <div className="mt-4 flex flex-col overflow-hidden rounded-lg bg-gray-200 sm:flex-row md:h-80">
    <div className="order-first h-48 w-full bg-gray-300 sm:order-none sm:h-auto sm:w-1/2 lg:w-2/5">
      <picture>
        <img
          src="/assets/image/sengoku-hasha.webp"
          loading="lazy"
          alt="戦場を制覇し、戦国の覇者となれ！"
          className="h-full w-full object-cover object-center"
        />
      </picture>
    </div>
    <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
      <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl lg:text-4xl">Help center</h2>
      <p className="mb-8 max-w-md text-gray-600">
        Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
      </p>
      <div className="mx-auto mt-auto sm:ml-0">
        <a
          href="https://twitter.com/IXAnary"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block rounded-lg bg-white px-8 py-3 text-center text-sm font-semibold text-gray-800 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base"
        >
          Contact support (Twitter@IXAnary)
        </a>
      </div>
    </div>
  </div>
);

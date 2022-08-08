import { FC } from "react";
import { format } from "date-fns";

const cards = 2100;
const skills = 1700;
const pages = 4500;

export const OurTeam: FC = () => (
  <>
    <div className="mb-8 md:mb-12">
      <h2 className="mb-4 text-center text-2xl font-bold md:mb-6 lg:text-3xl">Our IXAnary by the numbers</h2>
      <p className="mx-auto max-w-screen-md text-center text-gray-400 dark:text-gray-500 md:text-lg">
        As of <time dateTime={new Date().toISOString()}>{format(new Date(), "yyyy-MM-dd")}</time>
      </p>
    </div>
    <div className="grid grid-cols-2 gap-6 rounded-lg bg-indigo-500 p-6 md:grid-cols-4 md:gap-8 md:p-8">
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{cards}</div>
        <div className="text-sm text-indigo-200 sm:text-base">Cards</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{skills}</div>
        <div className="text-sm text-indigo-200 sm:text-base">Skills</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{pages}</div>
        <div className="text-sm text-indigo-200 sm:text-base">Pages</div>
      </div>
      <a
        href="https://www.amazon.jp/hz/wishlist/ls/10OQ35MBI8WSF?ref_=wl_share"
        target="_blank"
        rel="noopener noreferrer"
        className="border-2 border-solid border-indigo-400 hover:border-white"
      >
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-white sm:text-2xl md:text-3xl">90+</div>
          <div className="text-sm text-indigo-200 sm:text-base">Tsundoku</div>
        </div>
      </a>
    </div>
  </>
);

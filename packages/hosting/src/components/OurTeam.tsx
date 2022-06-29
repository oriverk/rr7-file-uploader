import { FC } from "react";
import { format } from "date-fns";

export const OurTeam: FC = () => (
  <>
    <div className="mb-8 md:mb-12">
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">
        Our IXAnary by the numbers
      </h2>
      <p className="max-w-screen-md text-gray-500 md:text-lg text-center mx-auto">
        As of <time dateTime={new Date().toISOString()}>
          {format(new Date(), 'yyyy-MM-dd')}
        </time>
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 bg-indigo-500 rounded-lg gap-6 md:gap-8 p-6 md:p-8">
      <div className="flex flex-col items-center">
        <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold">2100+</div>
        <div className="text-indigo-200 text-sm sm:text-base">Cards</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold">1700+</div>
        <div className="text-indigo-200 text-sm sm:text-base">Skill</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold">4500+</div>
        <div className="text-indigo-200 text-sm sm:text-base">Pages</div>
      </div>
      <a
        href="https://www.amazon.jp/hz/wishlist/ls/10OQ35MBI8WSF?ref_=wl_share"
        target="_blank"
        rel="noopener noreferrer"
        className="border-2 border-solid border-indigo-400 hover:border-white"
      >
        <div className="flex flex-col items-center">
          <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold">90+</div>
          <div className="text-indigo-200 text-sm sm:text-base">Tsundoku</div>
        </div>
      </a>
    </div>
  </>
);

/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";

export const HelpCenter: FC = () => (
  <div className="md:h-80 flex flex-col sm:flex-row bg-gray-200 rounded-lg overflow-hidden">
    <div className="w-full sm:w-1/2 lg:w-2/5 h-48 sm:h-auto order-first sm:order-none bg-gray-300">
      <img
        src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&q=75&fit=crop&w=1000"
        loading="lazy"
        alt="by Andras Vas"
        className="w-full h-full object-cover object-center"
      />
    </div>

    <div className="w-full sm:w-1/2 lg:w-3/5 flex flex-col p-4 sm:p-8">
      <h2 className="text-gray-800 text-xl md:text-2xl lg:text-4xl font-bold mb-4">Help center</h2>

      <p className="max-w-md text-gray-600 mb-8">
        This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of
        a real written text.
      </p>

      <div className="mt-auto mx-auto sm:ml-0">
        <a
          href="https://twitter.com/IXAnary"
          target="_blank" rel="noreferrer noopener"
          className="inline-block bg-white hover:bg-gray-100 active:bg-gray-200 focus-visible:ring ring-indigo-300 text-gray-800 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
        >
          Contact support (Twitter@IXAnary)
        </a>
      </div>
    </div>
  </div>
);

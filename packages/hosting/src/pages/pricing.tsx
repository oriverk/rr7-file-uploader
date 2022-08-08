/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";
import { CheckIcon } from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";

import { Container } from "@/components/Container";
import { Seo } from "@/components/Seo";

const potato = import.meta.env.VITE_AMAZON_WISHLIST || "";
const buyMeCoffee = "https://www.buymeacoffee.com/ixanary";

const CheckList: FC<{ list: string[] }> = ({ list }) => (
  <div className="flex-1 bg-gray-100 rounded-lg space-y-3 px-4 py-6">
    {list.map((val) => (
      <div className="flex gap-2" key={val}>
        <CheckIcon className="w-6 h-6 text-indigo-500" />
        <span className="text-gray-600">{val}</span>
      </div>
    ))}
  </div>
);

const Pricing: FC = () => (
  <Container>
    <Seo pathname="/price" title="Price" description="Price" />
    <div className="max-w-screen-xl px-4 md:px-8 mx-auto">
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8 xl:mb-12">Pick your plan</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-12 mb-6 md:mb-8">
        {/* basic */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col border rounded-lg gap-4 p-4 pt-6">
            <h3 className="text-gray-800 text-2xl font-semibold text-center">Basic</h3>
            <div className="flex justify-center items-end gap-1">
              <span className="text-4xl text-gray-800 font-bold">0yen</span>
              <span className="text-gray-500">/ 1 month</span>
            </div>
            <div className="flex justify-center items-center text-gray-500 text-sm gap-1 mb-4">
              no money backguarantee
              <InformationCircleIcon className="w-4 h-4" />
            </div>
            <a
              href={potato}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
            >
              Select Basic
            </a>
          </div>
          <CheckList
            list={[
              "100 white lottery per day",
              "2.000 MB bandwidth per month",
              "200 tasks per month",
              "Comunity support",
            ]}
          />
        </div>
        {/* minimum */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col border border-indigo-500 rounded-lg relative gap-4 p-4 pt-6">
            <div className="flex justify-center absolute -top-3 inset-x-0">
              <span className="h-6 flex justify-center items-center bg-indigo-500 text-white text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1">
                most popular
              </span>
            </div>
            <h3 className="text-gray-800 text-2xl font-semibold text-center">Minimum</h3>
            <div className="flex justify-center items-end gap-1">
              <span className="text-4xl text-gray-800 font-bold">1000yen</span>
              <span className="text-gray-500">/ 1 month</span>
            </div>
            <div className="flex justify-center items-center text-gray-500 text-sm gap-1 mb-4">
              no money backguarantee
              <InformationCircleIcon className="w-4 h-4" />
            </div>
            <a
              href={buyMeCoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
            >
              Select Minimum
            </a>
          </div>
          <CheckList
            list={[
              "Unlimited file storage",
              "10 GB bandwidth per month",
              "10.000 tasks per month",
              "Comunity support",
              "Email support",
              "100 Webhooks",
            ]}
          />
        </div>
        {/* high */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col border rounded-lg gap-4 p-4 pt-6">
            <h3 className="text-gray-800 text-2xl font-semibold text-center">High</h3>
            <div className="flex justify-center items-end gap-1">
              <span className="text-4xl text-gray-800 font-bold">1000yen~</span>
              <span className="text-gray-500">/ 1 month</span>
            </div>
            <div className="flex justify-center items-center text-gray-500 text-sm gap-1 mb-4">
              no money backguarantee
              <InformationCircleIcon className="w-4 h-4" />
            </div>
            <a
              href={potato}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 hover:bg-gray-700 active:bg-gray-600 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
            >
              Select High
            </a>
          </div>
          <CheckList
            list={[
              "Unlimited file storage",
              "Unlimited bandwidth per month",
              "1.000.000 tasks per month",
              "Email and phone support",
              "Unlimited Webhooks",
            ]}
          />
        </div>
      </div>
    </div>
  </Container>
);

export default Pricing;

import { FC } from "react";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

import { Container } from "@/components/ui/Container";
import { Seo } from "@/components/Seo";

const potato = import.meta.env.VITE_AMAZON_WISHLIST || "";
const buyMeCoffee = "https://www.buymeacoffee.com/ixanary";

const CheckList: FC<{ list: string[] }> = ({ list }) => (
  <div className="flex-1 space-y-3 rounded-lg bg-gray-100 px-4 py-6">
    {list.map((val) => (
      <div className="flex gap-2" key={val}>
        <CheckIcon className="h-6 w-6 text-indigo-500" />
        <span className="text-gray-600">{val}</span>
      </div>
    ))}
  </div>
);

const Pricing: FC = () => (
  <Container>
    <Seo pathname="/price" title="Price" description="Price" />
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl xl:mb-12">Pick your plan</h2>
      <div className="mb-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 lg:gap-x-8">
        {/* basic */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4 pt-6">
            <h3 className="text-center text-2xl font-semibold text-gray-800">Basic</h3>
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl font-bold text-gray-800">0yen</span>
              <span className="text-gray-500">/ 1 month</span>
            </div>
            <div className="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
              no money backguarantee
              <InformationCircleIcon className="h-4 w-4" />
            </div>
            <a
              href={potato}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
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
          <div className="relative flex flex-col gap-4 rounded-lg border border-indigo-500 p-4 pt-6">
            <div className="absolute inset-x-0 -top-3 flex justify-center">
              <span className="flex h-6 items-center justify-center rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                most popular
              </span>
            </div>
            <h3 className="text-center text-2xl font-semibold text-gray-800">Minimum</h3>
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl font-bold text-gray-800">1000yen</span>
              <span className="text-gray-500">/ 1 month</span>
            </div>
            <div className="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
              no money backguarantee
              <InformationCircleIcon className="h-4 w-4" />
            </div>
            <a
              href={buyMeCoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
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
          <div className="flex flex-col gap-4 rounded-lg border p-4 pt-6">
            <h3 className="text-center text-2xl font-semibold text-gray-800">High</h3>
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl font-bold text-gray-800">1000yen~</span>
              <span className="text-gray-500">/ 1 month</span>
            </div>
            <div className="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
              no money backguarantee
              <InformationCircleIcon className="h-4 w-4" />
            </div>
            <a
              href={potato}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
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

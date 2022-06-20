/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";
import { IXAnary } from "../../Icons/IXAnary";
import { CopyRight } from "./Copyright";
import { SocialLinks } from "./SocialLinks";

export const Footer: FC = () => (
  <footer className="bg-white">
    <div className="pt-12 lg:pt-16">
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          <div className="col-span-full lg:col-span-2">
            <div className="lg:-mt-2 mb-4">
              <a
                href="/"
                className=""
                aria-label="logo"
              >
                <IXAnary className="w-30 h-8" />
              </a>
            </div>

            <p className="text-gray-500 sm:pr-8 mb-6">
              Filler text is dummy text which has no meaning however looks very similar to real text
            </p>

            <SocialLinks />
          </div>

          <div>
            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">Products</div>

            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Overview
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Solutions
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Pricing
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Customers
                </a>
              </div>
            </nav>
          </div>

          <div>
            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">Company</div>

            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  About
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Investor Relations
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Jobs
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Press
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Blog
                </a>
              </div>
            </nav>
          </div>

          <div>
            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">Support</div>

            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Contact
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Documentation
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Chat
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  FAQ
                </a>
              </div>
            </nav>
          </div>

          <div>
            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">Legal</div>

            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Terms of Service
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Privacy Policy
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                >
                  Cookie settings
                </a>
              </div>
            </nav>
          </div>
        </div>

        <CopyRight />
      </div>
    </div>
  </footer>
);

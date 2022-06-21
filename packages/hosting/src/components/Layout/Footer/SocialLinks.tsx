import { FC } from "react"
import {
  // GitHub, Linkedin, Instagram,
  Twitter
} from "../../Icons"

export const SocialLinks: FC = () => (
  <div className="flex gap-4">
    <a
      href="https://twitter.com/IXAnary"
      target="_blank" rel="noreferrer noopener"
      className="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
    >
      <Twitter className="w-5 h-5" />
    </a>
    {/* <a
      href="#"
      target="_blank" rel="noreferrer noopener"
      className="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
    >
      <Instagram className="w-5 h-5" />
    </a>
    <a
      href="#"
      target="_blank" rel="noreferrer noopener"
      className="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
    >
      <Linkedin className="w-5 h-5" />
    </a>

    <a
      href="#"
      target="_blank" rel="noreferrer noopener"
      className="text-gray-400 hover:text-gray-500 active:text-gray-600 transition duration-100"
    >
      <GitHub className="w-5 h-5" />
    </a> */}
  </div>
)
import { FC } from "react";
import { Twitter } from "../../Icons";

export const SocialLinks: FC = () => (
  <div className="flex gap-4">
    <a
      href="https://twitter.com/IXAnary"
      target="_blank"
      rel="noreferrer noopener"
      className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
    >
      <Twitter className="h-5 w-5" />
    </a>
  </div>
);

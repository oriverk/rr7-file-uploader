import { FC } from "react";
import { X } from "../../ui/Icons";

export const SocialLinks: FC = () => (
  <div className="flex gap-4">
    <a
      href="https://twitter.com/IXAnary"
      target="_blank"
      rel="noreferrer noopener"
      className="p-1 bg-black text-white transition duration-100 hover:text-gray-200 active:text-gray-200"
    >
      <X className="h-5 w-5" />
    </a>
  </div>
);

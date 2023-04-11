import { useState, useEffect } from "react";
import { getCloudinaryImage } from "@/utils/getCloudinaryImage";
import { Ootono } from "@/constants/ootono";

type ReturnType = {
  name: string;
  url: string;
};

/**
 * @param chapter 章
 * @returns "{name, url}"
 */
export function useRandomHeroImage(chapter: number) {
  const [image, setImage] = useState<ReturnType>({
    name: "",
    url: "",
  });

  useEffect(() => {
    const images = Ootono[chapter];
    const random = Math.floor(Math.random() * images.length);
    const name = images[random];
    const ext = "webp";
    const url = getCloudinaryImage(`ixanary/chapter${chapter}/${name}.${ext}`);
    setImage((prev) => ({ ...prev, name, url }));
  }, [chapter]);

  return image;
}

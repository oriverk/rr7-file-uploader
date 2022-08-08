import { useState, useEffect } from "react";
import { getCloudinaryImage } from "@/utils/getCloudinaryImage";

const Data: Record<string, string[]> = {
  // chapter22: 天廻争乱～覇者開闢に抗いし戦鬼～
  22: [
    "uesugi",
    "mouri",
    "mogami",
    "honda",
    "sanada",
    "fukushima",
    "toyotomi",
    "toudou",
    "chosokabe",
    "kobayakawa",
    "kuroda",
    "shouneiou",
  ],
  // chapter23: 下天開闢～導かれし宿星～
  23: [
    "saito_dousan",
    "imagawa_yoshimoto",
    "akechi_mitsuhide",
    "takeda_harunobu",
    "nagao_kagetora",
    "matsudaira_motoyasu",
    "hashiba_hideyoshi",
    "matsunaga_hisahide",
    "ootomo_sourin",
    "mori_ranmaru",
    "kuki_yoshitaka",
    "araki_murashige",
    "oda_nobunaga",
  ],
  24: [
    "hachisuka", "hori", "kato", "kunohe", "kuroda", "maeda", "saika", "sanada", "shibata", "shimazu", "takenaka", "toyotomi", "ukita"
  ]
};

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
    const images = Data[chapter];
    const random = Math.floor(Math.random() * images.length);
    const name = images[random];
    const ext = chapter < 24 ? "webp" : "jpg"
    const url = getCloudinaryImage(`ixanary/chapter${chapter}/${name}.${ext}`);
    setImage((prev) => ({ ...prev, name, url }));
  }, [chapter]);

  return image;
}

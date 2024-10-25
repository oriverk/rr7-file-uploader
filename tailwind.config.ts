import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  daisyui: {
    themes: ["dark", "light", "synthwave"],
  },
} satisfies Config;

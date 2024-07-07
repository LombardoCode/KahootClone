import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "creator-classroom": "url('/assets/creator/bg/BGImg_Question_Classroom.jpg')"
      },
      scale: {
        '200': '2.00'
      },
      borderWidth: {
        '1': '1px',
        '1.5': '1.5px',
      },
      ringWidth: {
        '3': '3px'
      },
      colors: {
        'kahoot-red-100': "#FF99AA",
        'kahoot-red-200': "#FF3355",
        'kahoot-red-300': "#E21B3C",
        'kahoot-red-400': "#C60929",

        'kahoot-blue-100': "#A2D1F2",
        'kahoot-blue-200': "#45A3E5",
        'kahoot-blue-300': "#1368CE",
        'kahoot-blue-400': "#0542B9",

        'kahoot-yellow-100': "#FFDD33",
        'kahoot-yellow-200': "#FFC00A",
        'kahoot-yellow-300': "#FFA602",
        'kahoot-yellow-400': "#D89E00",

        'kahoot-green-100': "#B2DF9C",
        'kahoot-green-200': "#66BF39",
        'kahoot-green-300': "#26890C",
        'kahoot-green-400': "#0F6B03",
      }
    },
  },
  plugins: [],
};
export default config;

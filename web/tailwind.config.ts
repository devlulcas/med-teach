import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              "50": "#ede4fa",
              "100": "#d3bff4",
              "200": "#ba99ed",
              "300": "#a073e6",
              "400": "#874ee0",
              "500": "#6d28d9",
              "600": "#5a21b3",
              "700": "#471a8d",
              "800": "#341367",
              "900": "#210c41",
              foreground: "#fff",
              DEFAULT: "#6d28d9",
            },
            focus: "#5f00f9",
          },
        },
        dark: {
          colors: {
            primary: {
              "50": "#210c41",
              "100": "#341367",
              "200": "#471a8d",
              "300": "#5a21b3",
              "400": "#6d28d9",
              "500": "#874ee0",
              "600": "#a073e6",
              "700": "#ba99ed",
              "800": "#d3bff4",
              "900": "#ede4fa",
              foreground: "#fff",
              DEFAULT: "#6d28d9",
            },
            focus: "#5f00f9",
          },
        },
      },
    }),
  ],
};

export default config;

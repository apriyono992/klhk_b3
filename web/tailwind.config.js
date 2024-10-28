/** @type {import('tailwindcss').Config} */

const {nextui} = require("@nextui-org/react");
const { color } = require('framer-motion');

module.exports = {
  content: [
    "./public/index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    './public/index.html',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    color: {
      'white': '#ffffff',
      'default': "#F3F6FF",
      'primary': "#4CAF50",
      'secondary': "#795548",
      'success': "#22c55e",
      'danger': "#ef4444",
      'warning': "#eab308",
    },
    extend: {},
    fontFamily: {
      poppins: ["Poppins", "sans-serif"]
    },
    daisyui: {
      themes: [],
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            default: {
              DEFAULT: "#f3f4f6",
              foreground: "#000",
              
            },
            primary: {
              DEFAULT: "#4CAF50",
              foreground: "#fff",
              
            },
            secondary: {
              DEFAULT: "#795548",
              foreground: "#fff",
              
            },
            success: {
              DEFAULT: "#22c55e",
              foreground: "#fff",
              
            },
            danger: {
              DEFAULT: "#ef4444",
              foreground: "#fff",
              
            },
            warning: {
              DEFAULT: "#eab308",
              foreground: "#fff",
              
            },
          },
        },
        dark: {},
      }
    }),
  ],
}


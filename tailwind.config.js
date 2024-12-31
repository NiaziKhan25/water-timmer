/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js}", "./public/**/*{.html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#eb7c6b",
        secondary: "#231f20",
      },
      fontFamily: {
        'sans': ["IBM Plex Sans", ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
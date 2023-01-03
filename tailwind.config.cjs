/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:"#1D9BF0"
      },
      screens:{
        'xs':"375px"
      }
    },
  },
  plugins: [require("daisyui")],
};

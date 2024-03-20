/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-add-user': '0px 0px 0px 3px inset, 10px -10px 0px -3px #b248fe, 10px -10px 0px 0px #17171B, 20px -20px 0px -3px #FFFFFF, 20px -20px 0px 0px #17171B, 30px -30px 0px -3px #FFFFFF, 30px -30px 0px 0px #17171B',
        'custom-manage-funds': '0px 0px 0px 3px inset, 10px -10px 0px -3px #FFFFFF, 10px -10px 0px 0px #17171B, 20px -20px 0px -3px #b248fe, 20px -20px 0px 0px #17171B, 30px -30px 0px -3px #FFFFFF, 30px -30px 0px 0px #17171B',
        'custom-transfer': '0px 0px 0px 3px inset, 10px -10px 0px -3px #FFFFFF, 10px -10px 0px 0px #17171B, 20px -20px 0px -3px #FFFFFF, 20px -20px 0px 0px #17171B, 30px -30px 0px -3px #b248fe, 30px -30px 0px 0px #17171B',
      }
    },
  },
  plugins: [],
}


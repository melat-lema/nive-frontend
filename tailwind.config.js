    // tailwind.config.js
    module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
      safelist: [
        'bg-red-500',
        'bg-blue-500',
        // ... add other dynamically generated color classes
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
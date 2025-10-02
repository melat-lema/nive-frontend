// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss7-compat': {
      tailwindConfig: './tailwind.config.cjs', // ← now pointing to .cjs
    },
    autoprefixer: {},
  },
};
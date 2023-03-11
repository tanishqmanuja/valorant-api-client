module.exports = {
  arrowParens: "avoid",
  printWidth: 80,
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  useTabs: false,
  importOrder: ["<THIRD_PARTY_MODULES>", "^[~/]", "^[./]"],
  importOrderSeparation: true,
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
};

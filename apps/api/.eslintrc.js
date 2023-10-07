/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: { browser: false, es2020: true, node: true },
  extends: ["eskiu/ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [],
  rules: {
    "new-cap": "off",
    "no-duplicate-imports": "off",
  },
};

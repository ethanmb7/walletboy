const [IGNORE, WARNING, ERROR] = [0, 1, 2];

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-ts-comment": IGNORE,
    "@typescript-eslint/ban-types": WARNING,
    "@typescript-eslint/explicit-module-boundary-types": IGNORE,
    "@typescript-eslint/no-empty-function": IGNORE,
    "@typescript-eslint/no-explicit-any": IGNORE,
    "@typescript-eslint/no-unused-vars": IGNORE,
    "import/default": WARNING,
    "import/export": WARNING,
    "import/named": WARNING,
    "import/namespace": WARNING,
    "import/no-cycle": WARNING,
    "import/no-unresolved": WARNING,
    "no-undef": IGNORE,
    "no-unused-vars": IGNORE,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
};

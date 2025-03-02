import antfu from "@antfu/eslint-config"

export default antfu({
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  ignores: [
    "node_modules/",
    "**/node_modules/**/",
    ".next/",
    "**/.next/**/",
    "out/",
    "**/out/**/",
    "dist/",
    "**/dist/**/",
    "public/",
    "**/public/**/",
  ],
  stylistic: {
    quotes: "double",
    semi: false,
  },
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "no-alert": "off",
    "no-warning-comments": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/better-regex": "off",
    "unicorn/prefer-top-level-await": "off",
    "unicorn/prefer-dom-node-dataset": "off",
    "unicorn/expiring-todo-comments": [
      "warn",
      {
        allowWarningComments: false,
      },
    ],
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-implicit-any-catch": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "n/prefer-global/process": "off",
    "import/no-cycle": "off",
    "import/no-unassigned-import": "off",
    "import/order": [
      "error",
      {
        groups: [["builtin", "external"]],
      },
    ],
  },
})

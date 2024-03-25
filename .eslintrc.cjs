/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      files: ["./src/trpc/server.ts", "./src/components/ui/input.tsx", "./src/components/ui/input-otp.tsx", "./src/components/ui/form.tsx"], // Specify the file(s) you want to ignore TypeScript checking for
      rules: {
        "@typescript-eslint/ban-ts-comment": "off" // Disable the rule that prevents the use of "@ts-nocheck"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    "@typescript-eslint/ban-ts-comment": "off", // Ignore ban-ts-comment rule
    "@typescript-eslint/no-unsafe-argument": "off" // Ignore no-unsafe-argument rule
  }
}
module.exports = config;
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginTypeScript from "typescript-eslint";
import eslintPluginStylistic from "@stylistic/eslint-plugin";

import {Linter} from "eslint";

export default [
  ...eslintPluginTypeScript.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    "rules": {
      "no-console": ["error", {"allow": ["warn", "error"]}],
      "no-alert": ["error"],
      "no-debugger": ["error"]
    }
  },
  {
    "plugins": {
      "stylistic": eslintPluginStylistic
    },
    "rules": {
      "stylistic/indent": ["error", 2],
      "stylistic/multiline-comment-style": ["error"],
      "stylistic/spaced-comment": ["error"],
      "stylistic/block-spacing": ["error"],
      "stylistic/brace-style": ["error", "1tbs"],
      "stylistic/comma-dangle": ["error"],
      "stylistic/comma-spacing": ["error"],
      "stylistic/function-call-spacing": ["error", "never"],
      "stylistic/key-spacing": ["error"],
      "stylistic/keyword-spacing": ["error"],
      "stylistic/member-delimiter-style": ["error", {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "multilineDetection": "brackets"
      }],
      "stylistic/no-extra-parens": ["error"],
      "stylistic/no-extra-semi": ["error"],
      "stylistic/object-curly-newline": ["error"],
      "stylistic/object-curly-spacing": ["error"],
      "stylistic/quote-props": ["error"],
      "stylistic/quotes": ["error", "double", {"avoidEscape": true, "allowTemplateLiterals": true}],
      "stylistic/semi": ["error"],
      "stylistic/space-before-blocks": ["error"],
      "stylistic/space-before-function-paren": ["error"],
      "stylistic/space-infix-ops": ["error"],
      "stylistic/type-annotation-spacing": ["error"]
    }
  },
  {
    "ignores": [".astro/*"]
  }
] satisfies Linter.Config[];
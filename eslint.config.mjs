import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const banXsPlugin = {
  rules: {
    "no-text-xs": {
      meta: {
        type: "problem",
        docs: {
          description: "Ban text-xs class to enforce typography readability standards",
        },
        schema: [],
        messages: {
          noTextXs:
            "Font size 'text-xs' (12px) is banned to guarantee readability and field accessibility. Use 'text-sm' (14px) or larger instead.",
        },
      },
      create(context) {
        function checkString(node, text) {
          if (typeof text === "string" && /\btext-xs\b/.test(text)) {
            context.report({
              node,
              messageId: "noTextXs",
            });
          }
        }
        return {
          Literal(node) {
            if (typeof node.value === "string") {
              checkString(node, node.value);
            }
          },
          TemplateElement(node) {
            if (node.value && typeof node.value.raw === "string") {
              checkString(node, node.value.raw);
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      readability: banXsPlugin,
    },
    rules: {
      "readability/no-text-xs": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated vendor files copied from node_modules by postinstall:
    "public/maplibre-gl-*.mjs",
  ]),
]);

export default eslintConfig;

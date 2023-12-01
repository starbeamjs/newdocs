import { readFileSync } from "node:fs";

import { container } from "@mdit/plugin-container";
import { mark } from "@mdit/plugin-mark";
import { snippet } from "@mdit/plugin-snippet";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vitepress";
import { withTwoslash } from "vitepress-plugin-shiki-twoslash";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

import { codeSnippet } from "./snippet.mjs";

// https://vitepress.dev/reference/site-config
export default withTwoslash(
  defineConfig({
    title: "Starbeam",
    description: "Reactivity made simple and fun",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: "Home", link: "/" },
        { text: "Universal", link: "/docs/universal/getting-started" },
      ],

      sidebar: {
        "/docs/universal/": [
          {
            text: "Getting Started",
            link: "/docs/universal/getting-started",
          },
          {
            text: "Our Guiding Principle",
            link: "/docs/universal/guiding-principle",
          },
          {
            text: "Fundamentals",
            items: [
              {
                text: "What Can Become Reactive?",
                link: "/docs/universal/fundamentals/interception",
              },
              {
                text: "Rendering",
                link: "/docs/universal/fundamentals/rendering",
              },
              {
                text: "Reactive Builtins",
                link: "/docs/universal/fundamentals/builtins",
              },
              {
                text: "Reactive Properties",
                link: "/docs/universal/fundamentals/properties",
              },
              {
                text: "Reactive Synchronization",
                link: "/docs/universal/fundamentals/sync",
              },
            ],
          },
        ],
        "/": [
          {
            text: "Examples",
            items: [
              {
                text: "Markdown Examples",
                link: "/markdown-examples",
              },
            ],
          },
        ],
      },

      socialLinks: [
        { icon: "github", link: "https://github.com/starbeamjs/starbeam" },
      ],
    },

    markdown: {
      theme: { dark: "vitesse-dark", light: "vitesse-light" },

      attrs: {
        leftDelimiter: "[[",
        rightDelimiter: "]]",
      },
      config: (md) => {
        md.use(mark);
        md.use(container, {
          name: "em",
          openRender: () => `<div class="em tip custom-block">`,
          closeRender: () => `</div>`,
        });
        md.use(tabsMarkdownPlugin);
        md.use(snippet);
      },
    },

    vite: {
      plugins: [
        {
          name: "md-preprocess",

          load: function (id) {
            if (id.endsWith(".md")) {
              const code = readFileSync(id, { encoding: "utf-8" });
              return codeSnippet(id, code, this);
            }
          },
        },
        Unfonts({
          google: {
            display: "block",
            families: [
              {
                name: "Readex Pro",
                styles: "ital,wght@0,160..700;1,160..700",
              },
              {
                name: "Azeret Mono",
                styles: "ital,wght@0,100..900;1,100..900",
              },
              {
                name: "Comfortaa",
                styles: "ital,wght@0,400..700;1,400..700",
              },
            ],
          },
        }),
      ],
    },
  }),
);

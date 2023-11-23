// https://vitepress.dev/guide/custom-theme
// eslint-disable-next-line simple-import-sort/imports
import DefaultTheme from "vitepress/theme-without-fonts";
import "vitepress-plugin-shiki-twoslash/styles.css";
import "./style.css";
import "./syntax.css";
import "./custom.css";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";

import type { Theme } from "vitepress";
import { h } from "vue";

export default {
  extends: DefaultTheme,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router: _router, siteData: _siteData }) {
    enhanceAppWithTabs(app);
    // ...
  },
} satisfies Theme;

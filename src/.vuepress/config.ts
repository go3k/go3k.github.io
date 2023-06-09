import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "go3k",
      description: "go3k的个人播客。",
      
    },
    "/en/": {
      lang: "en-US",
      title: "go3k",
      description: "This is go3k's blog.",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

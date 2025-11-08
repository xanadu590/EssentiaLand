import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

import { viteBundler } from '@vuepress/bundler-vite'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  base:  isProd ? '/EssentiaLand/' : '/',

  locales: {
    "/en/": {
      lang: "en-US",
      title: "EssentiaLand WIKI",
      description: "EssentiaLand Original Worldbuilding WIKI",
    },
    "/": {
      lang: "zh-CN",
      title: "魔法大陆",
      description: "EssentiaLand 原创世界观百科",
    },
  },

  theme,
  
  bundler: viteBundler(), // ← 指定打包器

  

  // Enable it with pwa
  // shouldPrefetch: false,
});


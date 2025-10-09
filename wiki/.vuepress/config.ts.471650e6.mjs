// wiki/.vuepress/config.ts
import { defineUserConfig } from "vuepress";

// wiki/.vuepress/theme.ts
import { hopeTheme } from "vuepress-theme-hope";

// wiki/.vuepress/navbar/en.ts
import { navbar } from "vuepress-theme-hope";
var enNavbar = navbar([
  "/en/"
]);

// wiki/.vuepress/navbar/zh.ts
import { navbar as navbar2 } from "vuepress-theme-hope";
var zhNavbar = navbar2([
  "/"
]);

// wiki/.vuepress/sidebar/en.ts
import { sidebar } from "vuepress-theme-hope";
var enSidebar = sidebar({
  "/en/": []
});

// wiki/.vuepress/sidebar/zh.ts
import { sidebar as sidebar2 } from "vuepress-theme-hope";
var zhSidebar = sidebar2({
  "/": []
});

// wiki/.vuepress/theme.ts
var theme_default = hopeTheme({
  hostname: "https://zenithworld.com",
  author: {
    name: "xanadu590"
  },
  pageInfo: ["Author", "Date", "Category", "Tag", "Word", "ReadingTime"],
  logo: "https://theme-hope-assets.vuejs.press/logo.svg",
  repo: "vuepress-theme-hope/vuepress-theme-hope",
  docsDir: "wiki",
  locales: {
    "/en/": {
      // navbar
      navbar: enNavbar,
      // sidebar
      sidebar: enSidebar,
      footer: "Default footer",
      displayFooter: true,
      metaLocales: {
        editLink: "Edit this page on GitHub"
      }
    },
    /**
     * Chinese locale config
     */
    "/": {
      // navbar
      navbar: zhNavbar,
      // sidebar
      sidebar: zhSidebar,
      footer: "\u9ED8\u8BA4\u9875\u811A",
      displayFooter: true,
      // page meta
      metaLocales: {
        editLink: "\u5728 GitHub \u4E0A\u7F16\u8F91\u6B64\u9875"
      }
    }
  },
  encrypt: {
    config: {
      "/en/demo/encrypt.html": {
        hint: "Password: 1234",
        password: "1234"
      },
      "/demo/encrypt.html": {
        hint: "Password: 1234",
        password: "1234"
      }
    }
  },
  // These features are enabled for demo, only preserve features you need here
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended"
            };
        }
      }
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true
    // uncomment these if you need TeX support
    // math: {
    //   // install katex before enabling it
    //   type: "katex",
    //   // or install mathjax-full before enabling it
    //   type: "mathjax",
    // },
    // install chart.js before enabling it
    // chartjs: true,
    // install echarts before enabling it
    // echarts: true,
    // install flowchart.ts before enabling it
    // flowchart: true,
    // install mermaid before enabling it
    // mermaid: true,
    // playground: {
    //   presets: ["ts", "vue"],
    // },
    // install @vue/repl before enabling it
    // vuePlayground: true,
    // install sandpack-vue3 before enabling it
    // sandpack: true,
    // install @vuepress/plugin-revealjs and uncomment these if you need slides
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },
  },
  plugins: {
    git: {
      createdTime: true,
      // 显示创建时间
      updatedTime: true,
      // 显示最后更新时间
      contributors: false
      // 不显示贡献者
    },
    // ✅ slimsearch 只写“配置对象”或 true
    slimsearch: {
      // 是否索引正文（默认 false）
      indexContent: true,
      // 本地化占位符（只配 placeholder 即可）
      locales: {
        "/en/": { placeholder: "Search" },
        "/": { placeholder: "\u641C\u7D22\u6587\u6863" }
      },
      // 触发聚焦搜索框的快捷键 —— 用“对象”写法，避免 TS 报错
      hotKeys: [
        { key: "k", ctrl: true },
        // Ctrl + K
        { key: "/", ctrl: true }
        // Ctrl + /
      ],
      // 可选：历史数量与防抖
      queryHistoryCount: 5,
      resultHistoryCount: 5,
      searchDelay: 150
      // 可选：过滤哪些页面参与索引
      // filter: (page) => page.path !== '/drafts/',
      // 可选：中文等需要分词时再配 indexOptions / indexLocaleOptions
      // indexOptions: { ... },
      // indexLocaleOptions: { '/zh/': { ... } },
    },
    // 如果你之前还配置了 search / search-pro，请删掉或设为 false，避免冲突：
    // search: false,
    // 'search-pro': false,
    // Note: This is for testing ONLY!
    // You MUST generate and use your own comment service in production.
    comment: false,
    photoSwipe: {
      // i18n
      locales: {
        "/en/": { close: "Close", fullscreen: "Fullscreen" },
        "/": { close: "\u5173\u95ED", fullscreen: "\u5168\u5C4F" }
      }
    },
    components: {
      components: ["Badge", "VPCard"]
    },
    icon: {
      prefix: "fa6-solid:"
    }
    // Install @vuepress/plugin-pwa and uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  }
});

// wiki/.vuepress/config.ts
import { viteBundler } from "@vuepress/bundler-vite";
var config_default = defineUserConfig({
  base: "/",
  locales: {
    "/en/": {
      lang: "en-US",
      title: "ZenithWorld WIKI",
      description: "ZenithWorld Original Worldbuilding WIKI"
    },
    "/": {
      lang: "zh-CN",
      title: "\u5DC5\u5CF0\u4E16\u754C",
      description: "ZenithWorld \u539F\u521B\u4E16\u754C\u89C2\u767E\u79D1"
    }
  },
  theme: theme_default,
  bundler: viteBundler()
  // ← 指定打包器
  // Enable it with pwa
  // shouldPrefetch: false,
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2lraS8udnVlcHJlc3MvY29uZmlnLnRzIiwgIndpa2kvLnZ1ZXByZXNzL3RoZW1lLnRzIiwgIndpa2kvLnZ1ZXByZXNzL25hdmJhci9lbi50cyIsICJ3aWtpLy52dWVwcmVzcy9uYXZiYXIvemgudHMiLCAid2lraS8udnVlcHJlc3Mvc2lkZWJhci9lbi50cyIsICJ3aWtpLy52dWVwcmVzcy9zaWRlYmFyL3poLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHN1cGVyXFxcXFplbml0aFdvcmxkXFxcXHdpa2lcXFxcLnZ1ZXByZXNzXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3MvY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lVXNlckNvbmZpZyB9IGZyb20gXCJ2dWVwcmVzc1wiO1xuXG5pbXBvcnQgdGhlbWUgZnJvbSBcIi4vdGhlbWUuanNcIjtcblxuaW1wb3J0IHsgdml0ZUJ1bmRsZXIgfSBmcm9tICdAdnVlcHJlc3MvYnVuZGxlci12aXRlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVVc2VyQ29uZmlnKHtcbiAgYmFzZTogXCIvXCIsXG5cbiAgbG9jYWxlczoge1xuICAgIFwiL2VuL1wiOiB7XG4gICAgICBsYW5nOiBcImVuLVVTXCIsXG4gICAgICB0aXRsZTogXCJaZW5pdGhXb3JsZCBXSUtJXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJaZW5pdGhXb3JsZCBPcmlnaW5hbCBXb3JsZGJ1aWxkaW5nIFdJS0lcIixcbiAgICB9LFxuICAgIFwiL1wiOiB7XG4gICAgICBsYW5nOiBcInpoLUNOXCIsXG4gICAgICB0aXRsZTogXCJcdTVEQzVcdTVDRjBcdTRFMTZcdTc1NENcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlplbml0aFdvcmxkIFx1NTM5Rlx1NTIxQlx1NEUxNlx1NzU0Q1x1ODlDMlx1NzY3RVx1NzlEMVwiLFxuICAgIH0sXG4gIH0sXG5cbiAgdGhlbWUsXG4gIFxuICAgIGJ1bmRsZXI6IHZpdGVCdW5kbGVyKCksIC8vIFx1MjE5MCBcdTYzMDdcdTVCOUFcdTYyNTNcdTUzMDVcdTU2NjhcblxuICAvLyBFbmFibGUgaXQgd2l0aCBwd2FcbiAgLy8gc2hvdWxkUHJlZmV0Y2g6IGZhbHNlLFxufSk7XG5cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHN1cGVyXFxcXFplbml0aFdvcmxkXFxcXHdpa2lcXFxcLnZ1ZXByZXNzXFxcXHRoZW1lLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9zdXBlci9aZW5pdGhXb3JsZC93aWtpLy52dWVwcmVzcy90aGVtZS50c1wiO2ltcG9ydCB7IGhvcGVUaGVtZSB9IGZyb20gXCJ2dWVwcmVzcy10aGVtZS1ob3BlXCI7XG5cbmltcG9ydCB7IGVuTmF2YmFyLCB6aE5hdmJhciB9IGZyb20gXCIuL25hdmJhci9pbmRleC5qc1wiO1xuXG5pbXBvcnQgeyBlblNpZGViYXIsIHpoU2lkZWJhciB9IGZyb20gXCIuL3NpZGViYXIvaW5kZXguanNcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGhvcGVUaGVtZSh7XG4gIGhvc3RuYW1lOiBcImh0dHBzOi8vemVuaXRod29ybGQuY29tXCIsXG5cbiAgYXV0aG9yOiB7XG4gICAgbmFtZTogXCJ4YW5hZHU1OTBcIixcbiAgfSxcblxuICBwYWdlSW5mbzpbXCJBdXRob3JcIiwgXCJEYXRlXCIsIFwiQ2F0ZWdvcnlcIiwgXCJUYWdcIiwgXCJXb3JkXCIsIFwiUmVhZGluZ1RpbWVcIl0sXG5cbiAgbG9nbzogXCJodHRwczovL3RoZW1lLWhvcGUtYXNzZXRzLnZ1ZWpzLnByZXNzL2xvZ28uc3ZnXCIsXG5cbiAgcmVwbzogXCJ2dWVwcmVzcy10aGVtZS1ob3BlL3Z1ZXByZXNzLXRoZW1lLWhvcGVcIixcblxuICBkb2NzRGlyOiBcIndpa2lcIixcblxuICBsb2NhbGVzOiB7XG4gICAgXCIvZW4vXCI6IHtcbiAgICAgIC8vIG5hdmJhclxuICAgICAgbmF2YmFyOiBlbk5hdmJhcixcblxuICAgICAgLy8gc2lkZWJhclxuICAgICAgc2lkZWJhcjogZW5TaWRlYmFyLFxuXG4gICAgICBmb290ZXI6IFwiRGVmYXVsdCBmb290ZXJcIixcblxuICAgICAgZGlzcGxheUZvb3RlcjogdHJ1ZSxcblxuICAgICAgbWV0YUxvY2FsZXM6IHtcbiAgICAgICAgZWRpdExpbms6IFwiRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViXCIsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGluZXNlIGxvY2FsZSBjb25maWdcbiAgICAgKi9cbiAgICBcIi9cIjoge1xuICAgICAgLy8gbmF2YmFyXG4gICAgICBuYXZiYXI6IHpoTmF2YmFyLFxuXG4gICAgICAvLyBzaWRlYmFyXG4gICAgICBzaWRlYmFyOiB6aFNpZGViYXIsXG5cbiAgICAgIGZvb3RlcjogXCJcdTlFRDhcdThCQTRcdTk4NzVcdTgxMUFcIixcblxuICAgICAgZGlzcGxheUZvb3RlcjogdHJ1ZSxcblxuICAgICAgLy8gcGFnZSBtZXRhXG4gICAgICBtZXRhTG9jYWxlczoge1xuICAgICAgICBlZGl0TGluazogXCJcdTU3MjggR2l0SHViIFx1NEUwQVx1N0YxNlx1OEY5MVx1NkI2NFx1OTg3NVwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIGVuY3J5cHQ6IHtcbiAgICBjb25maWc6IHtcbiAgICAgIFwiL2VuL2RlbW8vZW5jcnlwdC5odG1sXCI6IHtcbiAgICAgICAgaGludDogXCJQYXNzd29yZDogMTIzNFwiLFxuICAgICAgICBwYXNzd29yZDogXCIxMjM0XCIsXG4gICAgICB9LFxuICAgICAgXCIvZGVtby9lbmNyeXB0Lmh0bWxcIjoge1xuICAgICAgICBoaW50OiBcIlBhc3N3b3JkOiAxMjM0XCIsXG4gICAgICAgIHBhc3N3b3JkOiBcIjEyMzRcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICAvLyBUaGVzZSBmZWF0dXJlcyBhcmUgZW5hYmxlZCBmb3IgZGVtbywgb25seSBwcmVzZXJ2ZSBmZWF0dXJlcyB5b3UgbmVlZCBoZXJlXG4gIG1hcmtkb3duOiB7XG4gICAgYWxpZ246IHRydWUsXG4gICAgYXR0cnM6IHRydWUsXG4gICAgY29kZVRhYnM6IHRydWUsXG4gICAgY29tcG9uZW50OiB0cnVlLFxuICAgIGRlbW86IHRydWUsXG4gICAgZmlndXJlOiB0cnVlLFxuICAgIGdmbTogdHJ1ZSxcbiAgICBpbWdMYXp5bG9hZDogdHJ1ZSxcbiAgICBpbWdTaXplOiB0cnVlLFxuICAgIGluY2x1ZGU6IHRydWUsXG4gICAgbWFyazogdHJ1ZSxcbiAgICBwbGFudHVtbDogdHJ1ZSxcbiAgICBzcG9pbGVyOiB0cnVlLFxuICAgIHN0eWxpemU6IFtcbiAgICAgIHtcbiAgICAgICAgbWF0Y2hlcjogXCJSZWNvbW1lbmRlZFwiLFxuICAgICAgICByZXBsYWNlcjogKHsgdGFnIH0pID0+IHtcbiAgICAgICAgICBpZiAodGFnID09PSBcImVtXCIpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0YWc6IFwiQmFkZ2VcIixcbiAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJ0aXBcIiB9LFxuICAgICAgICAgICAgICBjb250ZW50OiBcIlJlY29tbWVuZGVkXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICAgIHN1YjogdHJ1ZSxcbiAgICBzdXA6IHRydWUsXG4gICAgdGFiczogdHJ1ZSxcbiAgICB0YXNrbGlzdDogdHJ1ZSxcbiAgICB2UHJlOiB0cnVlLFxuXG4gICAgLy8gdW5jb21tZW50IHRoZXNlIGlmIHlvdSBuZWVkIFRlWCBzdXBwb3J0XG4gICAgLy8gbWF0aDoge1xuICAgIC8vICAgLy8gaW5zdGFsbCBrYXRleCBiZWZvcmUgZW5hYmxpbmcgaXRcbiAgICAvLyAgIHR5cGU6IFwia2F0ZXhcIixcbiAgICAvLyAgIC8vIG9yIGluc3RhbGwgbWF0aGpheC1mdWxsIGJlZm9yZSBlbmFibGluZyBpdFxuICAgIC8vICAgdHlwZTogXCJtYXRoamF4XCIsXG4gICAgLy8gfSxcblxuICAgIC8vIGluc3RhbGwgY2hhcnQuanMgYmVmb3JlIGVuYWJsaW5nIGl0XG4gICAgLy8gY2hhcnRqczogdHJ1ZSxcblxuICAgIC8vIGluc3RhbGwgZWNoYXJ0cyBiZWZvcmUgZW5hYmxpbmcgaXRcbiAgICAvLyBlY2hhcnRzOiB0cnVlLFxuXG4gICAgLy8gaW5zdGFsbCBmbG93Y2hhcnQudHMgYmVmb3JlIGVuYWJsaW5nIGl0XG4gICAgLy8gZmxvd2NoYXJ0OiB0cnVlLFxuXG4gICAgLy8gaW5zdGFsbCBtZXJtYWlkIGJlZm9yZSBlbmFibGluZyBpdFxuICAgIC8vIG1lcm1haWQ6IHRydWUsXG5cbiAgICAvLyBwbGF5Z3JvdW5kOiB7XG4gICAgLy8gICBwcmVzZXRzOiBbXCJ0c1wiLCBcInZ1ZVwiXSxcbiAgICAvLyB9LFxuXG4gICAgLy8gaW5zdGFsbCBAdnVlL3JlcGwgYmVmb3JlIGVuYWJsaW5nIGl0XG4gICAgLy8gdnVlUGxheWdyb3VuZDogdHJ1ZSxcblxuICAgIC8vIGluc3RhbGwgc2FuZHBhY2stdnVlMyBiZWZvcmUgZW5hYmxpbmcgaXRcbiAgICAvLyBzYW5kcGFjazogdHJ1ZSxcblxuICAgIC8vIGluc3RhbGwgQHZ1ZXByZXNzL3BsdWdpbi1yZXZlYWxqcyBhbmQgdW5jb21tZW50IHRoZXNlIGlmIHlvdSBuZWVkIHNsaWRlc1xuICAgIC8vIHJldmVhbGpzOiB7XG4gICAgLy8gICBwbHVnaW5zOiBbXCJoaWdobGlnaHRcIiwgXCJtYXRoXCIsIFwic2VhcmNoXCIsIFwibm90ZXNcIiwgXCJ6b29tXCJdLFxuICAgIC8vIH0sXG4gIH0sXG5cbiAgcGx1Z2luczoge1xuICAgIGdpdDoge1xuICAgICAgY3JlYXRlZFRpbWU6IHRydWUsICAgICAvLyBcdTY2M0VcdTc5M0FcdTUyMUJcdTVFRkFcdTY1RjZcdTk1RjRcbiAgICAgIHVwZGF0ZWRUaW1lOiB0cnVlLCAgICAgLy8gXHU2NjNFXHU3OTNBXHU2NzAwXHU1NDBFXHU2NkY0XHU2NUIwXHU2NUY2XHU5NUY0XG4gICAgICBjb250cmlidXRvcnM6IGZhbHNlLCAgIC8vIFx1NEUwRFx1NjYzRVx1NzkzQVx1OEQyMVx1NzMyRVx1ODAwNVxuICAgIH0sXG5cbiAgICAvLyBcdTI3MDUgc2xpbXNlYXJjaCBcdTUzRUFcdTUxOTlcdTIwMUNcdTkxNERcdTdGNkVcdTVCRjlcdThDNjFcdTIwMURcdTYyMTYgdHJ1ZVxuICAgIHNsaW1zZWFyY2g6IHtcbiAgICAgIC8vIFx1NjYyRlx1NTQyNlx1N0QyMlx1NUYxNVx1NkI2M1x1NjU4N1x1RkYwOFx1OUVEOFx1OEJBNCBmYWxzZVx1RkYwOVxuICAgICAgaW5kZXhDb250ZW50OiB0cnVlLFxuXG4gICAgICAvLyBcdTY3MkNcdTU3MzBcdTUzMTZcdTUzNjBcdTRGNERcdTdCMjZcdUZGMDhcdTUzRUFcdTkxNEQgcGxhY2Vob2xkZXIgXHU1MzczXHU1M0VGXHVGRjA5XG4gICAgICBsb2NhbGVzOiB7XG4gICAgICAgICcvZW4vJzogICB7IHBsYWNlaG9sZGVyOiAnU2VhcmNoJyB9LFxuICAgICAgICAnLyc6IHsgcGxhY2Vob2xkZXI6ICdcdTY0MUNcdTdEMjJcdTY1ODdcdTY4NjMnIH0sXG4gICAgICB9LFxuXG4gICAgICAvLyBcdTg5RTZcdTUzRDFcdTgwNUFcdTcxMjZcdTY0MUNcdTdEMjJcdTY4NDZcdTc2ODRcdTVGRUJcdTYzNzdcdTk1MkUgXHUyMDE0XHUyMDE0IFx1NzUyOFx1MjAxQ1x1NUJGOVx1OEM2MVx1MjAxRFx1NTE5OVx1NkNENVx1RkYwQ1x1OTA3Rlx1NTE0RCBUUyBcdTYyQTVcdTk1MTlcbiAgICAgIGhvdEtleXM6IFtcbiAgICAgICAgeyBrZXk6ICdrJywgY3RybDogdHJ1ZSB9LCAvLyBDdHJsICsgS1xuICAgICAgICB7IGtleTogJy8nLCBjdHJsOiB0cnVlIH0sIC8vIEN0cmwgKyAvXG4gICAgICBdLFxuXG4gICAgICAvLyBcdTUzRUZcdTkwMDlcdUZGMUFcdTUzODZcdTUzRjJcdTY1NzBcdTkxQ0ZcdTRFMEVcdTk2MzJcdTYyOTZcbiAgICAgIHF1ZXJ5SGlzdG9yeUNvdW50OiA1LFxuICAgICAgcmVzdWx0SGlzdG9yeUNvdW50OiA1LFxuICAgICAgc2VhcmNoRGVsYXk6IDE1MCxcblxuICAgICAgLy8gXHU1M0VGXHU5MDA5XHVGRjFBXHU4RkM3XHU2RUU0XHU1NEVBXHU0RTlCXHU5ODc1XHU5NzYyXHU1M0MyXHU0RTBFXHU3RDIyXHU1RjE1XG4gICAgICAvLyBmaWx0ZXI6IChwYWdlKSA9PiBwYWdlLnBhdGggIT09ICcvZHJhZnRzLycsXG5cbiAgICAgIC8vIFx1NTNFRlx1OTAwOVx1RkYxQVx1NEUyRFx1NjU4N1x1N0I0OVx1OTcwMFx1ODk4MVx1NTIwNlx1OEJDRFx1NjVGNlx1NTE4RFx1OTE0RCBpbmRleE9wdGlvbnMgLyBpbmRleExvY2FsZU9wdGlvbnNcbiAgICAgIC8vIGluZGV4T3B0aW9uczogeyAuLi4gfSxcbiAgICAgIC8vIGluZGV4TG9jYWxlT3B0aW9uczogeyAnL3poLyc6IHsgLi4uIH0gfSxcbiAgICB9LFxuXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU0RjYwXHU0RTRCXHU1MjREXHU4RkQ4XHU5MTREXHU3RjZFXHU0RTg2IHNlYXJjaCAvIHNlYXJjaC1wcm9cdUZGMENcdThCRjdcdTUyMjBcdTYzODlcdTYyMTZcdThCQkVcdTRFM0EgZmFsc2VcdUZGMENcdTkwN0ZcdTUxNERcdTUxQjJcdTdBODFcdUZGMUFcbiAgICAvLyBzZWFyY2g6IGZhbHNlLFxuICAgIC8vICdzZWFyY2gtcHJvJzogZmFsc2UsXG5cblxuXG4gICAgXG4gICAgLy8gTm90ZTogVGhpcyBpcyBmb3IgdGVzdGluZyBPTkxZIVxuICAgIC8vIFlvdSBNVVNUIGdlbmVyYXRlIGFuZCB1c2UgeW91ciBvd24gY29tbWVudCBzZXJ2aWNlIGluIHByb2R1Y3Rpb24uXG4gICAgY29tbWVudDogZmFsc2UsXG5cbiAgcGhvdG9Td2lwZToge1xuICAgIC8vIGkxOG5cbiAgICBsb2NhbGVzOiB7XG4gICAgICAnL2VuLyc6ICAgeyBjbG9zZTogJ0Nsb3NlJywgZnVsbHNjcmVlbjogJ0Z1bGxzY3JlZW4nIH0sXG4gICAgICAnLyc6IHsgY2xvc2U6ICdcdTUxNzNcdTk1RUQnLCBmdWxsc2NyZWVuOiAnXHU1MTY4XHU1QzRGJyB9LFxuICAgIH0sXG4gIH0sXG5cbiAgICBjb21wb25lbnRzOiB7XG4gICAgICBjb21wb25lbnRzOiBbXCJCYWRnZVwiLCBcIlZQQ2FyZFwiXSxcbiAgICB9LFxuXG4gICAgaWNvbjoge1xuICAgICAgcHJlZml4OiBcImZhNi1zb2xpZDpcIixcbiAgICB9LFxuXG4gICAgLy8gSW5zdGFsbCBAdnVlcHJlc3MvcGx1Z2luLXB3YSBhbmQgdW5jb21tZW50IHRoZXNlIGlmIHlvdSB3YW50IGEgUFdBXG4gICAgLy8gcHdhOiB7XG4gICAgLy8gICBmYXZpY29uOiBcIi9mYXZpY29uLmljb1wiLFxuICAgIC8vICAgY2FjaGVIVE1MOiB0cnVlLFxuICAgIC8vICAgY2FjaGVJbWFnZTogdHJ1ZSxcbiAgICAvLyAgIGFwcGVuZEJhc2U6IHRydWUsXG4gICAgLy8gICBhcHBsZToge1xuICAgIC8vICAgICBpY29uOiBcIi9hc3NldHMvaWNvbi9hcHBsZS1pY29uLTE1Mi5wbmdcIixcbiAgICAvLyAgICAgc3RhdHVzQmFyQ29sb3I6IFwiYmxhY2tcIixcbiAgICAvLyAgIH0sXG4gICAgLy8gICBtc1RpbGU6IHtcbiAgICAvLyAgICAgaW1hZ2U6IFwiL2Fzc2V0cy9pY29uL21zLWljb24tMTQ0LnBuZ1wiLFxuICAgIC8vICAgICBjb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgLy8gICB9LFxuICAgIC8vICAgbWFuaWZlc3Q6IHtcbiAgICAvLyAgICAgaWNvbnM6IFtcbiAgICAvLyAgICAgICB7XG4gICAgLy8gICAgICAgICBzcmM6IFwiL2Fzc2V0cy9pY29uL2Nocm9tZS1tYXNrLTUxMi5wbmdcIixcbiAgICAvLyAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAvLyAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcbiAgICAvLyAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgICB7XG4gICAgLy8gICAgICAgICBzcmM6IFwiL2Fzc2V0cy9pY29uL2Nocm9tZS1tYXNrLTE5Mi5wbmdcIixcbiAgICAvLyAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAvLyAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcbiAgICAvLyAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgICB7XG4gICAgLy8gICAgICAgICBzcmM6IFwiL2Fzc2V0cy9pY29uL2Nocm9tZS01MTIucG5nXCIsXG4gICAgLy8gICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgLy8gICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgIC8vICAgICAgIH0sXG4gICAgLy8gICAgICAge1xuICAgIC8vICAgICAgICAgc3JjOiBcIi9hc3NldHMvaWNvbi9jaHJvbWUtMTkyLnBuZ1wiLFxuICAgIC8vICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgIC8vICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICBdLFxuICAgIC8vICAgICBzaG9ydGN1dHM6IFtcbiAgICAvLyAgICAgICB7XG4gICAgLy8gICAgICAgICBuYW1lOiBcIkRlbW9cIixcbiAgICAvLyAgICAgICAgIHNob3J0X25hbWU6IFwiRGVtb1wiLFxuICAgIC8vICAgICAgICAgdXJsOiBcIi9kZW1vL1wiLFxuICAgIC8vICAgICAgICAgaWNvbnM6IFtcbiAgICAvLyAgICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHNyYzogXCIvYXNzZXRzL2ljb24vZ3VpZGUtbWFza2FibGUucG5nXCIsXG4gICAgLy8gICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgIC8vICAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcbiAgICAvLyAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgIC8vICAgICAgICAgICB9LFxuICAgIC8vICAgICAgICAgXSxcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICBdLFxuICAgIC8vICAgfSxcbiAgICAvLyB9LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6L1VzZXJzL3N1cGVyL1plbml0aFdvcmxkL3dpa2kvLnZ1ZXByZXNzL25hdmJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc3VwZXJcXFxcWmVuaXRoV29ybGRcXFxcd2lraVxcXFwudnVlcHJlc3NcXFxcbmF2YmFyXFxcXGVuLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9zdXBlci9aZW5pdGhXb3JsZC93aWtpLy52dWVwcmVzcy9uYXZiYXIvZW4udHNcIjtpbXBvcnQgeyBuYXZiYXIgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xuXG5leHBvcnQgY29uc3QgZW5OYXZiYXIgPSBuYXZiYXIoW1xuICBcIi9lbi9cIixcbl0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOi9Vc2Vycy9zdXBlci9aZW5pdGhXb3JsZC93aWtpLy52dWVwcmVzcy9uYXZiYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHN1cGVyXFxcXFplbml0aFdvcmxkXFxcXHdpa2lcXFxcLnZ1ZXByZXNzXFxcXG5hdmJhclxcXFx6aC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3MvbmF2YmFyL3poLnRzXCI7aW1wb3J0IHsgbmF2YmFyIH0gZnJvbSBcInZ1ZXByZXNzLXRoZW1lLWhvcGVcIjtcblxuZXhwb3J0IGNvbnN0IHpoTmF2YmFyID0gbmF2YmFyKFtcbiAgXCIvXCIsXG5dKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3Mvc2lkZWJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc3VwZXJcXFxcWmVuaXRoV29ybGRcXFxcd2lraVxcXFwudnVlcHJlc3NcXFxcc2lkZWJhclxcXFxlbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3Mvc2lkZWJhci9lbi50c1wiO2ltcG9ydCB7IHNpZGViYXIgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xuXG5leHBvcnQgY29uc3QgZW5TaWRlYmFyID0gc2lkZWJhcih7XG4gIFwiL2VuL1wiOiBbXG4gICAgXG4gIF0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3Mvc2lkZWJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc3VwZXJcXFxcWmVuaXRoV29ybGRcXFxcd2lraVxcXFwudnVlcHJlc3NcXFxcc2lkZWJhclxcXFx6aC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvc3VwZXIvWmVuaXRoV29ybGQvd2lraS8udnVlcHJlc3Mvc2lkZWJhci96aC50c1wiO2ltcG9ydCB7IHNpZGViYXIgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xuXG5leHBvcnQgY29uc3QgemhTaWRlYmFyID0gc2lkZWJhcih7XG4gIFwiL1wiOiBbXG5cbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUyxTQUFTLHdCQUF3Qjs7O0FDQW5DLFNBQVMsaUJBQWlCOzs7QUNBVixTQUFTLGNBQWM7QUFFeFUsSUFBTSxXQUFXLE9BQU87QUFBQSxFQUM3QjtBQUNGLENBQUM7OztBQ0p1VCxTQUFTLFVBQUFBLGVBQWM7QUFFeFUsSUFBTSxXQUFXQyxRQUFPO0FBQUEsRUFDN0I7QUFDRixDQUFDOzs7QUNKMFQsU0FBUyxlQUFlO0FBRTVVLElBQU0sWUFBWSxRQUFRO0FBQUEsRUFDL0IsUUFBUSxDQUVSO0FBQ0YsQ0FBQzs7O0FDTjBULFNBQVMsV0FBQUMsZ0JBQWU7QUFFNVUsSUFBTSxZQUFZQyxTQUFRO0FBQUEsRUFDL0IsS0FBSyxDQUVMO0FBQ0YsQ0FBQzs7O0FKRUQsSUFBTyxnQkFBUSxVQUFVO0FBQUEsRUFDdkIsVUFBVTtBQUFBLEVBRVYsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxF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

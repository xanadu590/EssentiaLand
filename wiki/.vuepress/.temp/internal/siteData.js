export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"en-US\",\"title\":\"\",\"description\":\"\",\"head\":[],\"locales\":{\"/en/\":{\"lang\":\"en-US\",\"title\":\"EssentiaLand WIKI\",\"description\":\"EssentiaLand Original Worldbuilding WIKI\"},\"/\":{\"lang\":\"zh-CN\",\"title\":\"魔法大陆\",\"description\":\"EssentiaLand 原创世界观百科\"}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}

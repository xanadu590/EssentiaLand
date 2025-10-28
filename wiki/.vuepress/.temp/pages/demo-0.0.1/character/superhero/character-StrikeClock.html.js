import comp from "C:/Users/super/ZenithWorld/wiki/.vuepress/.temp/pages/demo-0.0.1/character/superhero/character-StrikeClock.html.vue"
const data = JSON.parse("{\"path\":\"/demo-0.0.1/character/superhero/character-StrikeClock.html\",\"title\":\"警钟\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"警钟\",\"sidebar\":false,\"categroy\":[\"人类\",\"英雄\",\"黑科技使用者\"],\"tag\":[\"世界英雄\"],\"isOriginal\":true,\"description\":\"基本信息\"},\"git\":{\"createdTime\":1759711076000,\"updatedTime\":1760086595000},\"readingTime\":{\"minutes\":0.45,\"words\":136},\"filePathRelative\":\"demo-0.0.1/character/superhero/character-StrikeClock.md\",\"autoDesc\":true}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}

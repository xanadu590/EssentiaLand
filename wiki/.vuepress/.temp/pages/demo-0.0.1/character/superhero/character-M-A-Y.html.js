import comp from "C:/Users/super/ZenithWorld/wiki/.vuepress/.temp/pages/demo-0.0.1/character/superhero/character-M-A-Y.html.vue"
const data = JSON.parse("{\"path\":\"/demo-0.0.1/character/superhero/character-M-A-Y.html\",\"title\":\"月五\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"月五\",\"sidebar\":false,\"categroy\":[\"人类\",\"英雄\",\"异能者\"],\"tag\":[\"世界英雄\"],\"isOriginal\":true,\"description\":\"基本信息\"},\"git\":{\"createdTime\":1759711076000,\"updatedTime\":1760086595000},\"readingTime\":{\"minutes\":0.42,\"words\":126},\"filePathRelative\":\"demo-0.0.1/character/superhero/character-M-A-Y.md\",\"autoDesc\":true}")
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

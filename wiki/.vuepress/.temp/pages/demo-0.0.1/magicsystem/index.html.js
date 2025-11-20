import comp from "C:/Users/super/EssentiaLand/wiki/.vuepress/.temp/pages/demo-0.0.1/magicsystem/index.html.vue"
const data = JSON.parse("{\"path\":\"/demo-0.0.1/magicsystem/\",\"title\":\"魔法体系\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"icon\":\"user\",\"title\":\"魔法体系\",\"bgImageStyle\":{\"background-attachment\":\"fixed\"},\"heroText\":\"魔法体系\",\"tagline\":\"要认识魔法体系，就要理解魔法的每一个侧面。\",\"actions\":[{\"text\":\"魔法元素\",\"icon\":\"star\",\"link\":\"./element/\",\"type\":\"primary\"}]},\"git\":{},\"readingTime\":{\"minutes\":0.17,\"words\":50},\"filePathRelative\":\"demo-0.0.1/magicsystem/README.md\"}")
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

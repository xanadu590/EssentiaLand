import comp from "C:/Users/super/ZenithWorld/wiki/.vuepress/.temp/pages/demo-0.0.1/character/superhero/character-WizardHope.html.vue"
const data = JSON.parse("{\"path\":\"/demo-0.0.1/character/superhero/character-WizardHope.html\",\"title\":\"巫师希望\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"巫师希望\",\"sidebar\":false,\"categroy\":[\"人类\",\"英雄\",\"魔法师\"],\"tag\":[\"世界英雄\"],\"isOriginal\":true,\"description\":\"基本信息\"},\"git\":{\"createdTime\":1759711076000,\"updatedTime\":1760086595000},\"readingTime\":{\"minutes\":0.42,\"words\":127},\"filePathRelative\":\"demo-0.0.1/character/superhero/character-WizardHope.md\",\"autoDesc\":true}")
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

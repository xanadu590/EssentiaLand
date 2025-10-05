// wiki/.vuepress/client.ts
import { defineClientConfig } from 'vuepress/client'
import AIMedia from './components/AIMedia.vue'

export default defineClientConfig({
  enhance({ app }) {
    // 手动注册为全局组件（名字要和你在 MD 里写的一致）
    app.component('AIMedia', AIMedia)
  },
})
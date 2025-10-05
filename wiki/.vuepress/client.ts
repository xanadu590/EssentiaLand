// wiki/.vuepress/client.ts
import { defineClientConfig } from 'vuepress/client'
import { reactive, h } from 'vue'
import AIToggle from './components/AIToggle.vue'
import AIMedia from './components/AIMedia.vue'

export type AISetting = {
  show: boolean
  setShow: (v: boolean) => void
}
export const AI_INJECT_KEY = Symbol('AISetting')
const KEY = 'showAIImages'

export default defineClientConfig({
  enhance({ app }) {
    // 全站开关（默认 off，改成 'on' 则默认显示）
    const setting = reactive<AISetting>({
      show: typeof window !== 'undefined'
        ? (localStorage.getItem(KEY) ?? 'off') === 'on'
        : false,
      setShow(v: boolean) {
        setting.show = v
        if (typeof window !== 'undefined') {
          localStorage.setItem(KEY, v ? 'on' : 'off')
        }
      },
    })

    app.provide(AI_INJECT_KEY, setting)
    // 手动注册，确保 Markdown 里可用 <AIMedia/>
    app.component('AIMedia', AIMedia)
  },

  // 右上角总开关按钮
  rootComponents: [h(AIToggle)],
})
// .vuepress/client.ts
import { defineClientConfig } from 'vuepress/client'
import { reactive, h } from 'vue'
import AIToggle from './components/AIToggle.vue'

export type AISetting = {
  show: boolean
  setShow: (v: boolean) => void
}

const KEY = 'showAIImages'
export const AI_INJECT_KEY = Symbol('AISetting')

export default defineClientConfig({
  enhance({ app }) {
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
    // 全局注入
    app.provide(AI_INJECT_KEY, setting)
  },

  // 右上角悬浮的总开关
  rootComponents: [h(AIToggle)],
})
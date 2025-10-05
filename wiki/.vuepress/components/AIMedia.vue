<template>
  <div
    class="ai-media"
    :class="{ blurred: isAI && !localShow }"
    @click="isAI && toggleBlur()"
  >
    <img :src="src" :alt="alt" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  isAI?: boolean
}>()

// 从 AIToggle 注入的全局状态
const showAI = inject('showAI', ref(true))
const localShow = ref(showAI.value)

// 让它随全局按钮变化
watch(showAI, v => (localShow.value = v))

// 点击时允许单独切换（仅 AI 图有效）
const toggleBlur = () => {
  if (props.isAI) localShow.value = !localShow.value
}
</script>

<style scoped>
.ai-media {
  display: inline-block;
  margin: .5rem;
  cursor: pointer;
}
.ai-media img {
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  transition: filter .4s, transform .4s;
}
.ai-media.blurred img {
  filter: blur(18px) brightness(0.7);
  transform: scale(1.01);
}
</style>
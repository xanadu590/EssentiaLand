<template>
  <!-- 黑幕文字组件 -->
  <span
    class="blackout"
    :class="{ revealed }"
    @click="toggle"
  >
    <slot />
  </span>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 控制点击状态
 * revealed = 是否已揭示
 */
const revealed = ref(false)

const toggle = () => {
  revealed.value = !revealed.value
}
</script>

<style scoped>
/* 黑幕基础样式 */
.blackout {
  display: inline;               /* 保持行内布局 */
  color: transparent;
  background-color: #000;
  background-clip: padding-box;  /* 避免背景延伸到边界外 */
  border-radius: 3px;
  padding: 0 0.25em;             /* 适当减小左右留白，减少换行残影概率 */
  cursor: pointer;
  transition: color .25s ease, background-color .25s ease, box-shadow .25s ease;
  user-select: none;
  box-shadow: 0 0 2px #000;
  overflow: hidden;              /* 换行时裁掉背景边缘 */
}

.blackout:hover { background-color: #111; }

.blackout.revealed {
  color: inherit !important;
  background-color: transparent !important; /* 强制清干净 */
  box-shadow: none;
}

html[data-theme="dark"] .blackout { background-color: #444; box-shadow: 0 0 3px #000; }
html[data-theme="dark"] .blackout:hover { background-color: #555; }
</style>
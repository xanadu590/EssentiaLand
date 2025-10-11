<!-- wiki/.vuepress/components/LeadBlock.vue -->
<template>
  <ClientOnly>
    <!-- 只有有内容时才渲染，避免空块 -->
    <section
      v-if="hasContent"
      class="leadblock"
      role="note"
      aria-label="页面导语"
    >
      <!-- 简介：更醒目，行高舒适，超过宽度自动换行 -->
      <p v-if="summary" class="leadblock__summary">
        {{ summary }}
      </p >

      <!-- 台词：左侧强调线 + 引号装饰；与简介有区隔 -->
      <figure v-if="quote" class="leadblock__quote">
        <blockquote class="leadblock__qtext">“{{ quote }}”</blockquote>
      </figure>
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/** 只用 props，不依赖 vue-router / @vuepress/client 等注入 */
const props = defineProps<{
  summary?: string
  quote?: string
}>()

const summary = computed(() => String(props.summary ?? '').trim())
const quote   = computed(() => String(props.quote   ?? '').trim())

/** 有任一字段才展示 */
const hasContent = computed(() => !!(summary.value || quote.value))
</script>

<style scoped>
/* ===== 容器 ===== */
.leadblock{
  border: 1px solid var(--vp-c-border, #e5e7eb);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #fafafa);
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  padding: 14px 16px;
  margin: 12px 0 18px;
  display: grid;
  row-gap: 8px;
}

/* ===== 简介（靠右 + 自动破折号） ===== */
.leadblock__summary{
  margin: 0;
  text-align: right; /* ✅ 靠右 */
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.65;
  color: var(--c-text, #111);
  font-weight: 600;
  word-break: break-word;
  position: relative;
}
.leadblock__summary::before{
  content: "— "; /* ✅ 自动加破折号（不影响文本内容） */
  color: var(--c-text-light, #555);
  opacity: 0.7;
  margin-right: 2px;
}

/* ===== 台词（居中 + 灰色 + 略大） ===== */
.leadblock__quote{
  margin: 0;
  padding: 0;
  text-align: center; /* ✅ 居中 */
}
.leadblock__qtext{
  position: relative;
  display: inline-block;
  margin: 0 auto;
  padding-left: 10px;
  font-size: clamp(16px, 1.6vw, 19px); /* ✅ 略大 */
  line-height: 1.8;
  color: var(--c-text-light, #6b7280); /* ✅ 灰色 */
  word-break: break-word;
  font-style: italic;
}

/* 左侧强调条 */
.leadblock__qtext::before{
  content:"";
  position:absolute;
  left:0;
  top:0.45em;
  width:3px;
  height:1.2em;
  background: currentColor;
  opacity:.35;
  border-radius:2px;
}

/* ===== 暗色模式 ===== */
html[data-theme="dark"] .leadblock{
  border-color:#333;
  background: rgba(255,255,255,0.03);
}
html[data-theme="dark"] .leadblock__qtext{
  color:#b4bdc6;
}
html[data-theme="dark"] .leadblock__summary::before{
  color:#aaa;
}
</style>
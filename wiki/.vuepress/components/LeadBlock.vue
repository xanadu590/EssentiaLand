<!-- wiki/.vuepress/components/LeadBlock.vue -->
<template>
  <ClientOnly>
    <!-- 台词：可放在任意位置，可调大小/对齐，灰色、斜体、无边框 -->
    <blockquote
      v-if="quote"
      class="lead-quote"
      :style="{ fontSize: quoteSizePx, textAlign: quoteAlign }"
    >
      “{{ quote }}”
    </blockquote>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * 用法：
 * <LeadBlock quote="光之所在，即是吾之归途。" />
 * <LeadBlock quote="……" quoteSize="lg" quoteAlign="left" />
 * <LeadBlock quote="……" :quoteSize="20" quoteAlign="right" />
 */
const props = defineProps<{
  /** 台词文本（必填才显示） */
  quote?: string
  /** 字号：'sm' | 'md' | 'lg' | 数字(px) | 带单位字符串（px/rem/em/%） */
  quoteSize?: string | number
  /** 对齐：'left' | 'center' | 'right'（默认 center） */
  quoteAlign?: 'left' | 'center' | 'right'
}>()

const quote = computed(() => String(props.quote ?? '').trim())

/** 解析字号 */
const quoteSizePx = computed(() => {
  const v = props.quoteSize
  if (typeof v === 'number') return `${v}px`
  if (typeof v === 'string') {
    const map: Record<string, string> = { sm: '14px', md: '16px', lg: '20px' }
    if (map[v]) return map[v]
    if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(v)) return v
  }
  return '18px' // 默认字号
})

const quoteAlign = computed(() => props.quoteAlign ?? 'center')
</script>

<style scoped>
/* 台词：灰色、斜体、无边框，可独立放置 */
.lead-quote {
  margin: 8px 0;
  padding: 0;
  color: var(--c-text-light, #6b7280);
  font-style: italic;
  line-height: 1.75;
  word-break: break-word;
  border: none;
}

/* 暗色 */
html[data-theme="dark"] .lead-quote {
  color: #b4bdc6;
}
</style>
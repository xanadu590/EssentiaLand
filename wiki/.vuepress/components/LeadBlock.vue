<!-- /.vuepress/components/LeadBlock.vue -->
<template>
  <!-- 没有任何内容就不渲染 -->
  <section v-if="hasLead" class="lead">
    <!-- 一句话简介（所有页都可用） -->
    <p v-if="summary" class="lead-summary" :title="summary">
      {{ summary }}
    </p >

    <!-- 台词（人物页可选） -->
    <figure v-if="quote" class="lead-quote">
      <blockquote class="lead-quote-text">
        <span aria-hidden="true" class="quote-mark">“</span>
        <span class="quote-body">{{ quote }}</span>
        <span aria-hidden="true" class="quote-mark">”</span>
      </blockquote>
      <!-- 需要署名就给 frontmatter 加 author，会自动出现；不写就不显示 -->
      <figcaption v-if="author" class="lead-quote-author">— {{ author }}</figcaption>
    </figure>
  </section>
</template>

<script setup lang="ts">
import { usePageFrontmatter } from '@vuepress/client'
import { computed } from 'vue'

type FM = {
  summary?: string
  quote?: string
  quoteAuthor?: string
}

const fm = usePageFrontmatter<FM>()

const summary = computed(() => (fm.value.summary || '').trim())
const quote   = computed(() => (fm.value.quote   || '').trim())
const author  = computed(() => (fm.value.quoteAuthor || '').trim())

const hasLead = computed(() => !!summary.value || !!quote.value)
</script>

<style scoped>
.lead {
  /* 与标题的距离；可按需调大/调小 */
  margin: 10px 0 18px;
}

/* 一句话简介 */
.lead-summary {
  margin: 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft, #f7f7f9);
  color: var(--c-text, #222);
  font-size: clamp(14px, 1.8vw, 17px);
  line-height: 1.6;
  /* 两端对齐更像编辑好的导语，可改成 left */
  text-align: justify;
}

/* 台词整体区域 */
.lead-quote {
  margin: 10px 0 0;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--c-border, #e5e7eb);
  background: var(--vp-c-bg, #fff);
}

/* 引号文本 */
.lead-quote-text {
  margin: 0;
  color: var(--c-text, #111);
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.7;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

/* 左右大引号（装饰） */
.quote-mark {
  opacity: .4;
  font-size: 1.2em;
  line-height: 1;
}

.quote-body {
  /* 多行省略（最多 3 行），避免过长 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/* 署名（可选） */
.lead-quote-author {
  margin: 6px 2px 0;
  color: var(--c-text-light, #6b7280);
  font-size: 0.95em;
  text-align: right;
}

/* 暗色微调 */
html[data-theme='dark'] .lead-summary {
  background: rgba(255,255,255,0.05);
  color: #e5e7eb;
}
html[data-theme='dark'] .lead-quote {
  background: rgba(255,255,255,0.02);
  border-color: #333;
}
</style>
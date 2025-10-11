<!-- wiki/.vuepress/layouts/Layout.vue -->
<script setup lang="ts">
/**
 * 极简 Layout：
 * - 在正文开头自动显示“简介”（优先 frontmatter.summary；否则抓正文第一段）
 * - 不包含 TOC 与 DOM 移位
 * - 增强：等待正文真正渲染完成后再抓；必要时用 MutationObserver 兜底
 */
import { Layout } from "vuepress-theme-hope/client";
import { usePageFrontmatter } from "@vuepress/client";
import { computed, onMounted, nextTick, ref, onBeforeUnmount } from "vue";

type FM = { summary?: string };
const fm = usePageFrontmatter<FM>();

/** 1) 优先前置：frontmatter.summary */
const fmSummary = computed(() => (fm.value?.summary || "").trim());

/** 2) 运行时侦测：从正文抓第一段文字（仅当 frontmatter 没给时） */
const detectedSummary = ref("");
let mo: MutationObserver | null = null;

function pickFirstParagraph(): string {
  // 兼容多个主题的正文容器
  const roots: Element[] = [
    document.querySelector(".theme-hope-content"),
    document.querySelector(".theme-default-content"),
    document.querySelector(".content__default"),
    document.querySelector("article"),
    document.querySelector(".page"),
    document.querySelector("main"),
  ].filter(Boolean) as Element[];

  // 合并查找范围，跳过我们自己插入的 .auto-summary
  const selectors = [
    "p:not(.auto-summary)",
    ".theme-hope-content p:not(.auto-summary)",
    ".content__default p:not(.auto-summary)",
    "article p:not(.auto-summary)",
    ".page p:not(.auto-summary)",
    "main p:not(.auto-summary)",
  ];

  let text = "";
  for (const root of roots) {
    for (const sel of selectors) {
      const p = root.querySelector(sel) as HTMLParagraphElement | null;
      if (p) {
        text = (p.textContent || "").replace(/\s+/g, " ").trim();
        if (text) break;
      }
    }
    if (text) break;
  }
  // 截断到 160 字左右，避免过长
  if (text.length > 160) text = text.slice(0, 160) + "…";
  return text;
}

async function detectSummaryWithRetries() {
  // 等待一轮 DOM flush
  await nextTick();
  // 双 RAF，给主题/Markdown 组件额外渲染时间
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);

  let txt = pickFirstParagraph();
  if (txt) {
    detectedSummary.value = txt;
    console.debug("[auto-summary] grabbed:", txt);
    return;
  }

  // 若此时仍抓不到，启动 MutationObserver 监听正文变化，拿到即停
  const root =
    document.querySelector(".theme-hope-content") ||
    document.querySelector(".theme-default-content") ||
    document.querySelector(".content__default") ||
    document.querySelector("article") ||
    document.querySelector(".page") ||
    document.querySelector("main") ||
    document.body;

  if (!root) return;

  mo = new MutationObserver(() => {
    const t = pickFirstParagraph();
    if (t) {
      detectedSummary.value = t;
      console.debug("[auto-summary] grabbed via observer:", t);
      mo?.disconnect();
      mo = null;
    }
  });
  mo.observe(root, { childList: true, subtree: true });

  // 保险：5s 后自动停止观察，避免泄露
  setTimeout(() => {
    if (mo) {
      mo.disconnect();
      mo = null;
      console.debug("[auto-summary] observer timeout (5s) — nothing found");
    }
  }, 5000);
}

onMounted(async () => {
  if (!fmSummary.value) {
    detectSummaryWithRetries();
  }
});

onBeforeUnmount(() => {
  mo?.disconnect();
  mo = null;
});

/** 实际显示的简介 */
const summaryToShow = computed(() => fmSummary.value || detectedSummary.value);
</script>

<template>
  <Layout>
    <template #default>
      <div class="zen-page-wrap">
        <!-- 简介：仅当有内容时显示；居中样式 -->
        <p v-if="summaryToShow" class="auto-summary">
          {{ summaryToShow }}
        </p >

        <!-- 正文 -->
        <Content />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
/* 页面包裹（可按需加左右留白） */
.zen-page-wrap {}

/* 自动简介：居中显示、舒适行高 */
.auto-summary{
  margin: 12px 0 18px;
  text-align: center;
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.65;
  color: var(--c-text, #111);
  font-weight: 600;
  word-break: break-word;
}

/* 暗色 */
html[data-theme="dark"] .auto-summary{
  color: #e5e5e5;
}
</style>
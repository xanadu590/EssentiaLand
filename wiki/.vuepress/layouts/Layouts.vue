<!-- wiki/.vuepress/layouts/Layout.vue -->
<script setup lang="ts">
/**
 * 自定义 Layout：覆盖默认目录栏 (TOC)
 * + 在标题下方自动显示简介(summary)与台词(quote)
 */
import { Layout } from "vuepress-theme-hope/client";
import { usePageData, usePageFrontmatter } from "@vuepress/client";
import { computed } from "vue";
import LeadBlock from "../components/LeadBlock.vue"; // ★ 引入简介+台词组件

/* ===== 类型定义 ===== */
type Heading = {
  level: number;
  title: string;
  fullTitle?: string;
  text?: string;
  slug: string;
  link: string;
};

/* ===== 获取页面目录 headers ===== */
const page = usePageData();
const frontmatter = usePageFrontmatter<any>();

/** ★ 限制标题长度函数：保留前 n 个字，超出加省略号 */
function truncateTitle(str: string, max = 5) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

/** ★ 提取 headers 并处理显示文本 */
const headings = computed<Heading[]>(() => {
  const raw = (page.value.headers ?? []) as any[];
  return raw.map((h) => {
    const text = String(h?.title ?? h?.text ?? "");
    return {
      level: Number(h?.level ?? 2),
      title: truncateTitle(text, 5),
      fullTitle: text,
      text,
      slug: String(h?.slug ?? ""),
      link: String(h?.link ?? (h?.slug ? `#${h.slug}` : "#")),
    };
  });
});
</script>

<template>
  <Layout>
    <!-- 主体区域内容 -->
    <template #default>
      <main class="zen-page">
        <!-- 页面标题 -->
        <h1 class="zen-title">
          {{ frontmatter.title || page.title }}
        </h1>

        <!-- ★ 自动显示简介(summary)与台词(quote) -->
        <LeadBlock />

        <!-- 页面正文 -->
        <Content />
      </main>
    </template>

    <!-- 右侧目录栏 -->
    <template #toc>
      <aside class="zen-toc" aria-label="此页内容">
        <div class="zen-toc__title">此页内容</div>
        <nav class="zen-toc__body">
          <ol class="zen-toc__list">
            <li
              v-for="h in headings"
              :key="h.slug || h.link"
              :class="'lv-' + (h.level || 2)"
              :title="h.fullTitle"
            >
              <a :href="h.link">{{ h.title }}</a >
            </li>
          </ol>
        </nav>
      </aside>
    </template>
  </Layout>
</template>

<style scoped>
/* ===== 主体标题与内容 ===== */
.zen-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.zen-title {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  margin-top: 10px;
  margin-bottom: 8px;
  color: var(--c-text, #111);
  text-align: left;
}

/* ===== 右侧目录栏整体样式 ===== */
.zen-toc {
  width: var(--zen-toc-w, 180px);
  max-width: var(--zen-toc-w, 180px);
  position: sticky;
  top: var(--zen-toc-top, 84px);
  padding: 12px;
  border: 1px solid var(--vp-c-border, #e5e7eb);
  border-radius: 12px;
  background: var(--vp-c-bg-elv, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.zen-toc__title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 15px;
  color: var(--c-text, #111);
}

.zen-toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.zen-toc__list li {
  margin: 6px 0;
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.zen-toc__list li:hover {
  color: var(--c-text-accent, #0078e7);
}

.zen-toc__list li.lv-3 { padding-left: 12px; }
.zen-toc__list li.lv-4 { padding-left: 22px; }
.zen-toc__list li.lv-5 { padding-left: 30px; }
.zen-toc__list li.lv-6 { padding-left: 38px; }

.zen-toc__list a {
  text-decoration: none;
  color: inherit;
}

/* ===== 暗色模式 ===== */
html[data-theme='dark'] .zen-toc {
  border-color: #333;
  background: var(--vp-c-bg-soft, #0b0f19);
  color: var(--c-text, #e5e5e5);
}
html[data-theme='dark'] .zen-toc__list li:hover {
  color: #60a5fa;
}

/* ===== 小屏隐藏 ===== */
@media (max-width: 1024px) {
  .zen-toc {
    display: none;
  }
}
</style>
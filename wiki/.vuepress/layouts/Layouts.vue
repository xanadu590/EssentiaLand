<script setup lang="ts">
/**
 * 自定义 Layout：在正文顶部插入“简介/台词”引导块 + 自定义目录
 * - 兼容没有 #page / page-* 插槽的主题：只使用 #default
 */
import { Layout } from "vuepress-theme-hope/client";
import { usePageData, usePageFrontmatter } from "@vuepress/client";
import { computed } from "vue";
import LeadBlock from "../components/LeadBlock.vue";

/* ===== 目录相关（保持你原逻辑） ===== */
type Heading = {
  level: number;
  title: string;
  fullTitle?: string;
  text?: string;
  slug: string;
  link: string;
};

const page = usePageData();
function truncateTitle(str: string, max = 5) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}
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

/* ===== 从 Frontmatter 读简介/台词 ===== */
type FM = {
  summary?: string;
  quote?: string;
};
const fm = usePageFrontmatter<FM>();

const summary = computed(() => (fm.value?.summary || "").trim());
const quote = computed(() => (fm.value?.quote || "").trim());
const showLead = computed(() => !!(summary.value || quote.value));
</script>

<template>
  <Layout>
    <!-- 自定义 TOC（保持你原样） -->
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

    <!-- ✅ 只用默认插槽，把正文包起来，在最上面插入 LeadBlock -->
    <template #default>
      <div class="zen-page-wrap">
        <LeadBlock v-if="showLead" :summary="summary" :quote="quote" />
        <Content />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
/* ===== 右侧目录栏整体样式（保持你原样） ===== */
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
.zen-toc__list { list-style: none; margin: 0; padding: 0; }
.zen-toc__list li {
  margin: 6px 0;
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s ease;
}
.zen-toc__list li:hover { color: var(--c-text-accent, #0078e7); }
.zen-toc__list li.lv-3 { padding-left: 12px; }
.zen-toc__list li.lv-4 { padding-left: 22px; }
.zen-toc__list li.lv-5 { padding-left: 30px; }
.zen-toc__list li.lv-6 { padding-left: 38px; }
.zen-toc__list a { text-decoration: none; color: inherit; }

/* 暗色 */
html[data-theme='dark'] .zen-toc {
  border-color: #333;
  background: var(--vp-c-bg-soft, #0b0f19);
  color: var(--c-text, #e5e5e5);
}
html[data-theme='dark'] .zen-toc__list li:hover { color: #60a5fa; }

/* 小屏隐藏 */
@media (max-width: 1024px) { .zen-toc { display: none; } }

/* ===== 页面包裹（可按需加边距） ===== */
.zen-page-wrap {
  /* 可按需要给“引导块+正文”一个统一的左右留白 */
}
</style>
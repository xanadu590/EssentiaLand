<!-- wiki/.vuepress/components/RandomSidebar.vue -->
<template>
  <ClientOnly>
    <aside
      class="random-sidebar"
      :class="{ sticky }"
      v-if="ready && items.length"
      role="complementary"
      aria-label="随机文章推荐"
    >
      <div class="sb-title">随机推荐</div>

      <ul class="sb-list">
        <li
          v-for="it in items"
          :key="it.href"
          class="sb-item"
          @click="go(it)"
          @keydown.enter.prevent="go(it)"
          role="link"
          tabindex="0"
          :title="it.title || it.href"
        >
          <div class="sb-item-title">
            {{ it.title || nameFromPath(it.href) }}
          </div>
          <div class="sb-item-excerpt">
            {{ it.excerpt || brief(it) }}
          </div>
        </li>
      </ul>

      <button class="sb-refresh" @click="refresh" aria-label="换一批">换一批</button>
    </aside>

    <aside v-else class="random-sidebar empty" :class="{ sticky }">
      <div class="sb-title">随机推荐</div>
      <div class="sb-empty">
        暂无推荐
        <button class="sb-refresh" @click="refresh">重试</button>
      </div>
    </aside>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRandomPool, type RandomItem } from '../composables/useRandomPool'

const props = withDefaults(defineProps<{
  /** 展示条数 */
  count?: number
  /** 是否吸顶（跟随滚动固定在视口顶部） */
  sticky?: boolean
}>(), {
  count: 6,
  sticky: true,
})

const ready = ref(false)
const items = ref<RandomItem[]>([])

const { load, sample, resolveLink } = useRandomPool()

const refresh = async () => {
  if (!ready.value) {
    await load()
    ready.value = true
  }
  items.value = sample(Math.max(1, props.count))
}

const go = (it: RandomItem) => {
  window.location.assign(resolveLink(it.href))
}

function nameFromPath(p: string) {
  const m = p.match(/\/([^/]+)\.html$/)
  return m ? decodeURIComponent(m[1]) : p
}

function brief(i: RandomItem) {
  if (i.excerpt && i.excerpt.trim()) return i.excerpt.trim()
  if (i.title && i.title.trim()) return i.title.trim()
  return nameFromPath(i.href)
}

onMounted(refresh)
</script>

<style scoped>
/* —— 布局与外观 —— */
.random-sidebar {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}

/* 吸顶（右侧栏常见形态） */
.random-sidebar.sticky {
  position: sticky;
  top: 84px; /* 按你的导航高度微调 */
}

.sb-title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 16px;
  color: var(--c-text, #111);
}

.sb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.sb-item {
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
}

.sb-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  border-color: var(--c-border, #cbd5e1);
}

.sb-item-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--c-text, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.sb-item-excerpt {
  font-size: 13px;
  line-height: 1.55;
  color: var(--c-text-light, #65758b);
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.sb-refresh {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--c-border, #e5e7eb);
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  color: var(--c-text, #111);
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
}

/* 暗色 */
html[data-theme="dark"] .random-sidebar,
html[data-theme="dark"] .sb-item,
html[data-theme="dark"] .sb-refresh {
  border-color: #333;
  background: var(--vp-c-bg-soft, #0b0f19);
  color: var(--c-text, #e5e5e5);
}
html[data-theme="dark"] .sb-item-excerpt {
  color: #b4bdc6;
}

/* 小屏可隐藏右侧栏（按需调整） */
@media (max-width: 1024px) {
  .random-sidebar { display: none; }
}

/* 空态 */
.random-sidebar.empty .sb-empty {
  font-size: 13px;
  color: var(--c-text-light, #65758b);
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
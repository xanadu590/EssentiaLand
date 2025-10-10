<!-- wiki/.vuepress/components/RandomSidebar.vue -->
<template>
  <ClientOnly>
    <!-- 有数据时渲染推荐列表 -->
    <aside
      class="random-sidebar"
      :class="{ sticky, dock: dockRight }"
      v-if="ready && items.length"
      role="complementary"
      aria-label="随机文章推荐"
    >
      <div class="sb-title">也许你爱看：</div>

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

      <button class="sb-refresh" @click="refresh" aria-label="换一批" title="换一批">
        换一批
      </button>
    </aside>

    <!-- 空态 -->
    <aside v-else class="random-sidebar empty" :class="{ sticky, dock: dockRight }">
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

/** 可传入参数：条数 count、是否吸顶 sticky、是否右侧停靠 dockRight */
const props = withDefaults(
  defineProps<{
    count?: number
    sticky?: boolean
    dockRight?: boolean   // ★ 新增
  }>(),
  {
    count: 6,             // ★ 默认展示 6 条 ⇒ 在 2 列布局下正好是“三排”
    sticky: true,
    dockRight: true,      // ★ 默认启用右侧停靠
  },
)

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

// ★ 暴露给模板使用
const dockRight = props.dockRight
</script>

<style scoped>
/* ========= 外观与布局（原样） ========= */
.random-sidebar {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.random-sidebar.sticky {
  position: sticky;
  top: 84px;
}

/* ========= ★ 新增：右侧停靠样式（与原逻辑一致，仅用于把侧栏放入右侧留白） =========
   - 仅桌面端启用
   - 计算方式：
     内容最大宽度记为 --zw-content (默认 780px；与主题差不多，你可按站点实际调)
     右侧留白 = (100vw - --zw-content) / 2
     我们把侧栏放在内容区右边，再右移 24px 作为内容与侧栏的间距
*/
@media (min-width: 1200px) {
  .random-sidebar.dock {
    position: fixed;      /* 固定在视口，不挤正文 */
    top: 84px;
    width: var(--rs-width, 300px);  /* 侧栏宽度，可在使用处通过 style 覆盖 */

    /* 内容区宽度（按你的站点调，常见 740~820）*/
    --zw-content: var(--content-width, 780px);

    /* 放到“内容区右侧 + 24px” */
    left: calc(
      (100vw - var(--zw-content)) / 2 + var(--zw-content) + 100px
    );

    /* 安全边距，避免过窄屏幕时溢出到右边 */
    right: 16px;
    max-width: min(
      var(--rs-width, 300px),
      calc(100vw - 16px - ((100vw - var(--zw-content)) / 2 + var(--zw-content) + 24px))
    );
  }

  /* 页面正文可能 overflow: hidden；这里确保侧栏固定时可见 */
  :global(.theme-container),
  :global(.page) {
    overflow: visible;
  }
}

/* 小屏隐藏（原样） */
@media (max-width: 1024px) {
  .random-sidebar {
    display: none;
  }
}

/* 标题 */
.sb-title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 16px;
  color: var(--c-text, #111);
}

/* ========= ★ 列表区域：改为 2 列网格 =========
   - grid-template-columns: 2 列平均分
   - 默认 props.count = 6 ⇒ 3 行 × 2 列（正好三排）
*/
.sb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* ★ 关键：两列 */
  /* 如需更紧凑，可在使用处把 --rs-width 调大（例如 380~460px） */
}

/* 每条推荐卡片 */
.sb-item {
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  min-height: 130px; /* ★ 给卡片一个最小高度，保证两列对齐更整齐；可按需调整 */
}
.sb-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border-color: var(--c-border, #cbd5e1);
}

/* 推荐标题 */
.sb-item-title {
  font-weight: 600;
  font-size: 12px;
  color: var(--c-text, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

/* 推荐摘要 */
.sb-item-excerpt {
  font-size: 10px;
  line-height: 1.55;
  color: var(--c-text-light, #65758b);
  display: -webkit-box;
  -webkit-line-clamp: 2;  /* 最多两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

/* ========= ★ “换一批”按钮横跨两列 =========
   - 在上面的 Grid 中，让按钮占满整行，看起来更对称
*/
.sb-refresh {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--c-border, #e5e7eb);
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  color: var(--c-text, #111);
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  grid-column: 1 / -1; /* ★ 关键：跨两列 */
}

/* 暗色 */
html[data-theme='dark'] .random-sidebar,
html[data-theme='dark'] .sb-item,
html[data-theme='dark'] .sb-refresh {
  border-color: #333;
  background: var(--vp-c-bg-soft, #0b0f19);
  color: var(--c-text, #e5e5e5);
}
html[data-theme='dark'] .sb-item-excerpt {
  color: #b4bdc6;
}

/* 空态样式 */
.random-sidebar.empty .sb-empty {
  font-size: 13px;
  color: var(--c-text-light, #65758b);
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
<!-- wiki/.vuepress/components/RandomSidebar.vue -->
<template>
  <ClientOnly>
    <aside
      ref="dockEl"
      class="random-sidebar"
      :class="{ sticky, dock: dockRight }"
      v-if="ready && items.length"
      role="complementary"
      aria-label="随机文章推荐"
    >
      <div class="sb-scale-wrap">
        <!-- 标题+按钮移到 sb-scale-wrap 内部，便于相对网格定位 -->
        <div class="sb-header" ref="titleEl">
          <div class="sb-title">也许你爱看：</div>
          <button
            class="sb-refresh sb-refresh--inline"
            @click="refresh"
            aria-label="换一批"
            title="换一批"
          >
            换一批
          </button>
        </div>

        <ul class="sb-list" ref="listEl">
          <li
            v-for="it in itemsShown"
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
            <!-- ★ 外层负责“上下居中 + 左对齐”，内层做多行省略 -->
            <div class="sb-item-excerpt">
              <div class="sb-excerpt-inner">
                {{ it.excerpt || brief(it) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <!-- 空态 -->
    <aside
      ref="dockEl"
      v-else
      class="random-sidebar empty"
      :class="{ sticky, dock: dockRight }"
    >
      <div class="sb-title">随机推荐</div>
      <div class="sb-empty">
        暂无推荐
        <button class="sb-refresh" @click="refresh">重试</button>
      </div>
    </aside>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRandomPool, type RandomItem } from '../composables/useRandomPool'

const props = withDefaults(
  defineProps<{
    count?: number
    sticky?: boolean
    dockRight?: boolean
  }>(),
  {
    count: 6,
    sticky: true,
    dockRight: true,
  },
)

const ready = ref(false)
const items = ref<RandomItem[]>([])
const itemsShown = ref<RandomItem[]>([])
const { load, sample, resolveLink } = useRandomPool()

const go = (it: RandomItem) => window.location.assign(resolveLink(it.href))

function nameFromPath(p: string) {
  const m = p.match(/\/([^/]+)\.html$/)
  return m ? decodeURIComponent(m[1]) : p
}
function brief(i: RandomItem) {
  if (i.excerpt?.trim()) return i.excerpt.trim()
  if (i.title?.trim()) return i.title.trim()
  return nameFromPath(i.href)
}

const dockEl = ref<HTMLElement | null>(null)
/* titleEl 指向 .sb-header，用于测量 header 自身高度 */
const titleEl = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)

let ro: ResizeObserver | null = null
let rafId: number | null = null

onMounted(async () => {
  await refresh()
  setupAutoDock()
})
onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', scheduleRecalc as any)
  ro?.disconnect()
})

const refresh = async () => {
  if (!ready.value) {
    await load()
    ready.value = true
  }
  items.value = sample(Math.max(1, Math.min(6, props.count || 6)))
  scheduleRecalc()
}

function setupAutoDock() {
  if (!props.dockRight || !dockEl.value) return
  window.addEventListener('resize', scheduleRecalc, { passive: true })
  ro = new ResizeObserver(scheduleRecalc)
  ro.observe(document.documentElement)
  scheduleRecalc()
}
function scheduleRecalc() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    applyDockLayout()
    applyGridLayout()
  })
}

/* 外层尺寸：正文右缘→屏幕右缘 */
function applyDockLayout() {
  const host = dockEl.value!
  const vw = window.innerWidth
  const vh = window.innerHeight

  const rootStyle = getComputedStyle(document.documentElement)
  const contentW =
    parseFloat((rootStyle.getPropertyValue('--content-width') || '').replace('px', '')) || 780

  const hostStyle = getComputedStyle(host)
  const GAP = parseFloat(hostStyle.getPropertyValue('--dock-gap') || '24')
  const RIGHT_SAFE = parseFloat(hostStyle.getPropertyValue('--dock-right-safe') || '16')
  const TOP = parseFloat(hostStyle.getPropertyValue('--dock-top') || '84')
  const BOTTOM_SAFE = parseFloat(hostStyle.getPropertyValue('--dock-bottom-safe') || '16')

  const left = Math.round((vw - contentW) / 2 + contentW + GAP)
  const minWidth = 260
  const width = Math.max(minWidth, vw - left - RIGHT_SAFE)
  const height = Math.max(0, vh - TOP - BOTTOM_SAFE)

  host.style.setProperty('--dock-left', left + 'px')
  host.style.setProperty('--dock-width', width + 'px')
  host.style.setProperty('--dock-height', height + 'px')
}

/* 网格计算（header 绝对定位在网格上方；计算时要把 header 高度回写给样式） */
function applyGridLayout() {
  const host = dockEl.value!
  const list = listEl.value!

  const hostStyle = getComputedStyle(host)
  const outerW = parseFloat(hostStyle.getPropertyValue('--dock-width') || '0')
  const outerH = parseFloat(hostStyle.getPropertyValue('--dock-height') || '0')

  const PAD = 12 * 2
  const listStyle = getComputedStyle(list)

  const gapX =
    parseFloat(listStyle.getPropertyValue('column-gap') || '') ||
    parseFloat(listStyle.getPropertyValue('gap') || '') ||
    20
  const gapY =
    parseFloat(listStyle.getPropertyValue('row-gap') || '') ||
    parseFloat(listStyle.getPropertyValue('gap') || '') ||
    20

  const SOFT_X = parseFloat(hostStyle.getPropertyValue('--grid-soft-margin-x') || '12')
  const SOFT_Y = parseFloat(hostStyle.getPropertyValue('--grid-soft-margin-y') || '12')

  const availW = Math.max(0, outerW - PAD - SOFT_X * 2)
  /* 不扣标题高度；让 sb-scale-wrap 使用完整可用高 */
  const availH = Math.max(0, outerH - PAD - SOFT_Y * 2)

  const candidates = [
    { c: 2, r: 3 },
    { c: 1, r: 3 },
    { c: 2, r: 2 },
    { c: 1, r: 2 },
    { c: 1, r: 1 },
  ]

  const ratio = parseFloat(hostStyle.getPropertyValue('--card-ratio') || '') || 1.25

  let best = { c: 1, r: 1, w: 0, h: 0, n: 1, gridW: 0, gridH: 0 }
  for (const { c, r } of candidates) {
    if (c > r) continue
    const wByW = (availW - gapX * (c - 1)) / c
    const hByH = (availH - gapY * (r - 1)) / r
    const wByH = hByH / ratio
    const cardW = Math.floor(Math.max(0, Math.min(wByW, wByH)))
    const cardH = Math.floor(cardW * ratio)
    if (cardW <= 0 || cardH <= 0) continue

    const gridW = c * cardW + (c - 1) * gapX
    const gridH = r * cardH + (r - 1) * gapY
    const n = c * r
    const area = cardW * cardH
    const bestArea = best.w * best.h
    const better = n > best.n || (n === best.n && area > bestArea)
    if (better) best = { c, r, w: cardW, h: cardH, n, gridW, gridH }
  }

  const showN = Math.max(0, Math.min(best.n, items.value.length, 6))
  itemsShown.value = items.value.slice(0, showN)

  // 回写 gap / 宽高 / 轨道
  list.style.columnGap = `${gapX}px`
  list.style.rowGap = `${gapY}px`
  list.style.width = `${best.gridW}px`
  list.style.marginLeft = 'auto'
  list.style.marginRight = 'auto'
  list.style.gridTemplateColumns = `repeat(${best.c}, ${best.w}px)`
  list.style.gridAutoRows = `${best.h}px`

  // 写入总高度 & 单卡尺寸：用于上下居中与字体联动
  list.style.height = `${best.gridH}px`
  host.style.setProperty('--card-w', `${best.w}px`)
  host.style.setProperty('--card-h', `${best.h}px`)

  // 把“可用高度 / 网格总高 / 网格总宽 / 行距（纵向间距）”告诉样式
  host.style.setProperty('--viewport-h', `${availH}px`)
  host.style.setProperty('--grid-h', `${best.gridH}px`)
  host.style.setProperty('--grid-w', `${best.gridW}px`)
  host.style.setProperty('--grid-gap-y', `${gapY}px`)

  // 计算“摘要可显示行数”
  const cardPadding = 20
  const baseFont = Math.max(10, Math.min(16, best.w * 0.08))
  const titleFont = baseFont * 1.1
  const titleLineHeight = 1.2
  const titleBlock = titleFont * titleLineHeight + 4
  const availTextH = Math.max(0, best.h - cardPadding - titleBlock)
  const bodyLineH = baseFont * 1.6
  const lines = Math.max(1, Math.floor(availTextH / bodyLineH))
  host.style.setProperty('--f-base', `${baseFont}px`)
  host.style.setProperty('--excerpt-lines', String(lines))

  // 测量 header 自身高度，写入 --header-h，用于让 header 不与网格重叠
  const headerH = (titleEl.value?.getBoundingClientRect().height || 0)
  host.style.setProperty('--header-h', `${headerH}px`)
}

const dockRight = props.dockRight
</script>

<style scoped>
.random-sidebar {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;

  /* 外框完全透明 */
  border: none;
  background: transparent;
  box-shadow: none;

  /* 整块（标题+列表）在侧栏高度内上下居中（基础居中，sb-list 再做精确居中） */
  display: flex;
  flex-direction: column;
  justify-content: center;

  --dock-gap: 80px;
  --dock-right-safe: 50px;
  --dock-top: 84px;
  --dock-bottom-safe: 16px;
  --grid-soft-margin-x: 12px;
  --grid-soft-margin-y: 12px;
  --card-ratio: 1.25;

  /* header 与网格顶边的间距（默认取行距，JS 会把行距写入 --grid-gap-y） */
  --header-gap: var(--grid-gap-y, 20px);

  /* 由 JS 写入：用于绝对定位 */
  --grid-w: auto;
  --grid-h: 0px;
  --viewport-h: 100%;
  --header-h: 0px;
}

.random-sidebar.sticky {
  position: sticky;
  top: var(--dock-top, 84px);
}

@media (min-width: 1200px) {
  .random-sidebar.dock {
    position: fixed;
    top: var(--dock-top, 84px);
    left: var(
      --dock-left,
      calc((100vw - var(--content-width, 780px)) / 2 + var(--content-width, 780px) + var(--dock-gap, 24px))
    );
    width: var(--dock-width, 300px);
    height: var(--dock-height, calc(100vh - var(--dock-top, 84px) - var(--dock-bottom-safe, 16px)));
    right: var(--dock-right-safe, 16px);
    overflow: hidden;
  }
  :global(.theme-container),
  :global(.page) {
    overflow: visible;
  }
}

/* 列表容器：高度使用 JS 写入的可用高，并作为绝对居中的定位容器 */
.random-sidebar .sb-scale-wrap {
  width: 100%;
  height: var(--viewport-h, 100%);
  position: relative;   /* 让 sb-list / sb-header 使用绝对定位参照它 */
}

/* 标题行：放在“网格顶边的上方”，预留自身高度 + 行距，且与网格左右对齐 */
.sb-header {
  position: absolute;
  /* 网格上沿 = 50% - grid-h/2；header 顶边 = 上沿 - header-h - header-gap */
  top: calc(50% - var(--grid-h, 0px) / 2 - var(--header-h, 0px) - var(--header-gap, 20px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  width: var(--grid-w, auto);               /* 与网格同宽 */
  display: flex;
  align-items: center;
  justify-content: space-between;           /* 标题贴左、按钮贴右 */
  gap: 8px;
  margin: 0;
}

.sb-title {
  font-weight: 800;
  font-size: 18px;
  line-height: 1.2;
  margin: 0;
}

/* 间距明确：列距/行距 + 绝对几何居中（以可用高度的中心线为轴扩散） */
.sb-list {
  list-style: none;
  padding: 0;
  margin: 0;

  display: grid;
  --grid-gap-x: 20px;
  --grid-gap-y: 20px;
  column-gap: var(--grid-gap-x);
  row-gap: var(--grid-gap-y);
  gap: var(--grid-gap-y) var(--grid-gap-x);
  grid-auto-flow: row;

  /* 精确居中：把网格中心放在容器中心 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* 宽高、列数、行高由 JS 写入 */
  min-height: 0;
  overflow: hidden;
}

/* 卡片（字体跟随卡片宽度联动） */
.sb-item {
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  /* 基准字号：JS 写回 --f-base；无则按卡片宽度估算并限幅 */
  font-size: var(--f-base, clamp(10px, calc(var(--card-w, 180px) * 0.08), 16px));
}
.sb-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border-color: var(--c-border, #cbd5e1);
}

/* 标题：单行省略 */
.sb-item-title {
  font-weight: 600;
  font-size: 1.1em;
  color: var(--c-text, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-bottom: 4px;
}

/* 摘要（外层）：上下居中 + 左对齐；不做省略，避免布局冲突 */
.sb-item-excerpt {
  font-size: 0.95em;
  line-height: 1.6;
  color: var(--c-text-light, #65758b);

  /* 关键：用列方向的 Flex，纵向居中 + 水平靠左 */
  display: flex;
  flex-direction: column;
  justify-content: center;      /* 垂直居中 */
  align-items: flex-start;       /* 水平靠左 */

  flex: 1 1 auto;
  margin: 0;
  padding: 0 4px;
  overflow: hidden;              /* 防溢出 */
  text-align: left;
  white-space: normal;
  word-break: break-word;
}

/* 摘要（内层）：负责多行省略，保持左对齐 */
.sb-excerpt-inner {
  text-align: left;
  word-break: break-word;
  overflow: hidden;

  /* 多行省略 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--excerpt-lines, 3);
}

/* 按钮（通用 & 内联修饰） */
.sb-refresh {
  width: auto;               /* 标题行里使用，不需要占满 */
  margin-top: 0;
  border: 1px solid var(--c-border, #e5e7eb);
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  color: var(--c-text, #111);
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;
}
.sb-refresh--inline {}

html[data-theme='dark'] .random-sidebar,
html[data-theme='dark'] .sb-item,
html[data-theme='dark'] .sb-refresh {
  border-color: #333;
  background: transparent;
  color: #e5e5e5;
}
html[data-theme='dark'] .sb-item { background: rgba(255,255,255,0.02); }
html[data-theme='dark'] .sb-item-excerpt { color: #b4bdc6; }

/* 小屏隐藏 */
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
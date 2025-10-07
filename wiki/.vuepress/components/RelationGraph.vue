<template>
  <ClientOnly>
    <!-- 外层容器高度可通过 props.height 覆盖 -->
    <div ref="el" class="rg-wrap" :style="{ height: wrapHeight }"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import 'vis-network/styles/vis-network.css'

// 方案二：使用 standalone 构建（运行最稳，缺点是没有 d.ts）
// 为避免 TypeScript 报错，对 import 做一次忽略即可。
// 如果你的打包器对路径敏感，下面也可以改成：
//   'vis-network/standalone/esm/vis-network'
/* @ts-ignore */
import { Network } from 'vis-network/standalone'

type RelType = 'friend' | 'ally' | 'family' | 'enemy' | string

interface Node {
  id: string
  label: string
  url?: string
  group?: string
  image?: string  // 头像地址（可选，传了就用圆形头像）
}

interface Edge {
  from: string
  to: string
  type?: RelType    // 用来决定连线颜色
}

const props = defineProps<{
  height?: string | number
  nodes: Node[]
  edges: Edge[]
}>()

const wrapHeight = computed(
  () => (typeof props.height === 'number' ? `${props.height}px` : props.height || '480px')
)

const el = ref<HTMLElement | null>(null)
let net: any | null = null // standalone 无类型，这里用 any 避免 TS 红线

// 连线颜色方案
const edgeColors: Record<string, string> = {
  friend: '#34c759', // 好友  绿
  ally:   '#2eaadc', // 同盟  蓝
  family: '#a78bfa', // 家人  紫
  enemy:  '#ef4444', // 敌对  红
}

function buildData() {
  return {
    nodes: props.nodes.map(n => ({
      ...n,
      // 有头像就用圆形头像；没有就用 dot
      shape: n.image ? 'circularImage' : 'dot',
      image: n.image,
      size: n.image ? 28 : 18,
      font: { color: 'var(--c-text)', size: 16 },
      borderWidth: 1,
    })),
    edges: props.edges.map(e => ({
      ...e,
      color: edgeColors[e.type ?? 'ally'] ?? '#999',
      width: 2,
      smooth: { type: 'dynamic' },
    })),
  }
}

function mount() {
  if (!el.value) return
  const data = buildData()

  const options = {
    autoResize: true,
    layout: { improvedLayout: true },
    physics: { stabilization: true },
    nodes: {
      color: {
        border: 'var(--vp-c-border, var(--c-border, #dcdfe6))',
        background: 'var(--vp-c-bg-soft, var(--c-bg, #fff))',
      },
    },
    edges: {
      selectionWidth: 3,
      hoverWidth: 1.5,
    },
    interaction: { hover: true },
  }

  net = new Network(el.value, data, options)

  // 点击节点 → 跳转对应页（如果节点提供了 url）
  net.on('click', (params: any) => {
    const id = params?.nodes?.[0]
    if (!id) return
    const node = props.nodes.find(n => n.id === id)
    if (node?.url) window.location.assign(node.url)
  })
}

onMounted(mount)

onBeforeUnmount(() => {
  net?.destroy()
  net = null
})

// 数据变化 → 同步更新
watch(
  () => [props.nodes, props.edges],
  () => {
    if (!net) return
    net.setData(buildData())
  },
  { deep: true }
)
</script>

<style scoped>
.rg-wrap {
  width: 100%;
  border: 1px solid var(--vp-c-border, var(--c-border, #e5e7eb));
  border-radius: 12px;
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  box-shadow: 0 6px 24px rgba(0, 0, 0, .06);
}

/* 暗色模式适配：外框与底色 */
html[data-theme='dark'] .rg-wrap {
  background: var(--vp-c-bg-soft, #111);
  border-color: var(--vp-c-border, #333);
}
</style>

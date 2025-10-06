<template>
  <ClientOnly>
    <div ref="el" class="rg-wrap"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Network } from 'vis-network'

// 传入数据结构：节点 & 边
const props = defineProps<{
  height?: string | number
  /** 节点：id 唯一，label 显示名，可选 url、group、image(头像) */
  nodes: Array<{
    id: string
    label: string
    url?: string
    group?: string
    image?: string   // '/images/xxx.png' 开启后会显示圆形头像
  }>
  /** 边：from → to，可选 label（关系名），type 用于着色 */
  edges: Array<{
    from: string
    to: string
    label?: string
    type?: 'friend' | 'family' | 'ally' | 'enemy' | 'other'
  }>
}>()

const el = ref<HTMLElement | null>(null)
let net: Network | null = null

// 边的颜色方案（按关系类型）
const edgeColors: Record<string, string> = {
  friend: '#34c759',
  ally:   '#2eaadc',
  family: '#a78bfa',
  enemy:  '#ef4444',
  other:  '#9ca3af',
}

const build = () => {
  if (!el.value) return

  // 组织 vis-network 所需数据
  const data = {
    nodes: props.nodes.map(n => ({
      id: n.id,
      label: n.label,
      group: n.group,
      // 有头像就用圆形头像，没有就用圆形节点
      shape: n.image ? 'circularImage' : 'dot',
      image: n.image,
      size: n.image ? 40 : 18,
      color: {
        background: 'var(--vp-c-bg-soft, var(--c-bg, #ffffff))',
        border: 'var(--c-border, #e5e7eb)',
        highlight: { background: 'var(--vp-c-bg, #fff)', border: 'var(--c-brand, #3ea7ff)' }
      },
      font: {
        color: 'var(--c-text, #111)',
        face: 'inherit',
      }
    })),
    edges: props.edges.map(e => {
      const c = edgeColors[e.type || 'other']
      return {
        from: e.from,
        to: e.to,
        label: e.label,
        arrows: 'to',
        color: { color: c, highlight: c },
        font: { color: 'var(--c-text, #111)', align: 'top' },
        smooth: true,
      }
    }),
  }

  // 画布与交互设置
  const options = {
    autoResize: true,
    height: (typeof props.height === 'number' ? `${props.height}px` : props.height) || '420px',
    layout: { improvedLayout: true },
    physics: {
      solver: 'forceAtlas2Based',
      stabilization: { iterations: 150 },
    },
    interaction: {
      hover: true,
      tooltipDelay: 120,
      zoomView: true,
      dragView: true,
    },
    nodes: {
      borderWidth: 1,
      shapeProperties: { useBorderWithImage: true },
    },
  }

  net = new Network(el.value, data, options)

  // 点击节点 → 跳转对应人物页（若提供 url）
  net.on('click', params => {
    const id = params?.nodes?.[0]
    if (!id) return
    const node = props.nodes.find(n => n.id === id)
    if (node?.url) window.location.assign(node.url)
  })
}

onMounted(build)
onBeforeUnmount(() => { net?.destroy(); net = null })

// 数据变动时重建（用于后续扩展）
watch(() => [props.nodes, props.edges], () => {
  net?.destroy(); net = null
  build()
}, { deep: true })
</script>

<style scoped>
.rg-wrap{
  width: 100%;
  background: var(--vp-c-bg, var(--c-bg, #fff));
  border: 1px solid var(--c-border, #e5e7eb);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,.06);
}

/* 深色模式适配 */
html[data-theme="dark"] .rg-wrap{
  background: var(--vp-c-bg, #0f1115);
  border-color: #2f3136;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
}
</style>

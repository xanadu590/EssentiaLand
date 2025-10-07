<template>
  <!-- 视图：仅在客户端渲染，避免 SSR 报错 -->
  <ClientOnly>
    <!-- 容器：vis-network 会把画布挂到这个 div 上 -->
    <div ref="el" class="rg-wrap" :style="wrapStyle"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
/** ----------------------------------------------------------------------------
 *  模块：Vue 生命周期 + 计算属性
 *  作用：初始化关系图；监听数据变化；销毁时清理
 * ---------------------------------------------------------------------------*/
import { onMounted, onBeforeUnmount, ref, watch, computed, nextTick } from 'vue'

/** ----------------------------------------------------------------------------
 *  模块：vis-network 默认样式
 *  作用：引入节点/连线/交互的基础样式
 * ---------------------------------------------------------------------------*/
import 'vis-network/styles/vis-network.css'

/** ----------------------------------------------------------------------------
 *  类型：节点与边
 *  作用：限定 props 的数据结构，便于类型提示与校验
 * ---------------------------------------------------------------------------*/
type NodeItem = {
  id: string | number
  label: string
  url?: string
  group?: string
  image?: string
  shape?: string
}
type EdgeItem = { from: string | number; to: string | number; type?: string }

/** ----------------------------------------------------------------------------
 *  输入：组件属性
 *  作用：外部传入的节点、连线与高度
 * ---------------------------------------------------------------------------*/
const props = defineProps<{
  height?: number | string
  nodes: NodeItem[]
  edges: EdgeItem[]
}>()

/** ----------------------------------------------------------------------------
 *  实例引用与状态
 *  作用：el 是容器元素；net 是 vis-network 实例；nodeDS / edgeDS 是数据集
 * ---------------------------------------------------------------------------*/
const el = ref<HTMLElement | null>(null)
let net: any = null
let nodeDS: any = null
let edgeDS: any = null

/** ----------------------------------------------------------------------------
 *  常量：交互时的样式参数
 *  作用：统一管理“默认尺寸/悬停尺寸、默认/悬停线宽”等
 * ---------------------------------------------------------------------------*/
const DEFAULT_NODE_SIZE = 36
const HOVER_NODE_SIZE = 42
const DEFAULT_EDGE_WIDTH = 2
const HOVER_EDGE_WIDTH = 4

/** ----------------------------------------------------------------------------
 *  计算：容器样式
 *  作用：支持动态高度，且适配明暗主题的容器外观
 * ---------------------------------------------------------------------------*/
const wrapStyle = computed(() => {
  const h = typeof props.height === 'number' ? `${props.height}px` : (props.height || '420px')
  return {
    width: '100%',
    height: h,
    borderRadius: '12px',
    border: '1px solid var(--c-border, #e5e7eb)',
    background: 'var(--vp-c-bg-soft, var(--c-bg, #fff))',
    boxShadow: '0 2px 12px rgba(0,0,0,.06)',
  } as Record<string, string>
})

/** ----------------------------------------------------------------------------
 *  初始化：构建网络图
 *  作用：动态导入 vis-network；创建数据集和实例；绑定交互事件
 * ---------------------------------------------------------------------------*/
async function init() {
  if (!el.value) return

  // 动态导入，避免 SSR 期引用窗口对象
  const { Network, DataSet } = await import('vis-network/standalone')

  // 构造安全节点数组：如果节点包含 image 则使用 circularImage 形状，并通过 font.vadjust 向上微调文字位置，
  // 以修正带图片节点文字过远的问题；否则使用默认 dot 形状和字体。
  const safeNodes = (props.nodes ?? []).map(n => ({
    ...n,
    shape: n.image ? 'circularImage' : (n.shape || 'dot'),
    font: n.image ? { vadjust: -6 } : undefined,  // ★ 仅图像节点上调文字
  }))

  // 数据集：保存并暴露给悬停事件使用
  nodeDS = new DataSet(safeNodes)
  edgeDS = new DataSet(
    (props.edges ?? []).map(e => ({
      ...e,
      color: edgeColor(e.type),
      width: DEFAULT_EDGE_WIDTH,
      arrows: { to: { enabled: false } },
    })),
  )

  // 全局选中（加粗）样式：保证文字颜色“不变化”，仅加粗
  // 注意：这里配置的是“选中态”的文字样式（我们在 hover 时临时选择该节点）
  const fontCommonColor = 'var(--c-text, #111)'

  const options = {
    layout: { improvedLayout: true },
    physics: { enabled: true, stabilization: true },
    nodes: {
      shape: 'dot',
      size: DEFAULT_NODE_SIZE,
      borderWidth: 2,
      color: {
        border: 'var(--c-border, #cbd5e1)',
        background: 'var(--c-bg, #fff)',
        highlight: {
          border: 'var(--c-brand, #3eaf7c)',
          background: 'var(--vp-c-bg-soft, #f8fafc)',
        },
      },
      // 默认字体 + “选中态”字体：颜色保持不变，仅加粗
      font: {
        color: fontCommonColor,
        face: 'sans-serif',
        size: 14,
        bold: {
          color: fontCommonColor, // 加粗时仍保持同色
        },
      },
      // 头像加载失败时的占位
      brokenImage: '/images/fallback-avatar.png',
    },
    edges: {
      smooth: { enabled: true, type: 'dynamic' },
      color: { color: '#94a3b8', highlight: '#3eaf7c' },
      width: DEFAULT_EDGE_WIDTH,
    },
    interaction: {
      hover: true,    // 必须打开，才能响应 hoverNode / blurNode
      zoomView: true,
      dragView: true,
      selectable: true,
    },
  }

  // 创建网络实例
  net = new Network(el.value, { nodes: nodeDS, edges: edgeDS }, options)

  /** ------------------------------------------------------------------------
   *  交互：点击节点 → 若存在 url 则跳转
   * -----------------------------------------------------------------------*/
  net.on('click', (params: any) => {
    const id = params?.nodes?.[0]
    if (!id) return
    const node = (props.nodes || []).find(n => String(n.id) === String(id))
    if (node?.url) window.location.assign(node.url)
  })

  /** ------------------------------------------------------------------------
   *  交互：悬停节点 → 该节点图片变大、文字加粗（但不变色）、相连的边变粗
   *  做法：
   *    1) 通过 selectNodes 触发“选中态”从而加粗文字（颜色保持不变）
   *    2) 临时把节点 size 调大
   *    3) 把与之相连的边 width 调大
   * -----------------------------------------------------------------------*/
  net.on('hoverNode', ({ node }: { node: string | number }) => {
    // 文字加粗但不变色：使用“选中态”
    net.selectNodes([node], false)

    // 节点变大
    nodeDS.update({ id: node, size: HOVER_NODE_SIZE })

    // 相连的边变粗
    const eids = net.getConnectedEdges(node)
    if (Array.isArray(eids) && eids.length) {
      edgeDS.update(eids.map(id => ({ id, width: HOVER_EDGE_WIDTH })))
    }
  })

  /** ------------------------------------------------------------------------
   *  交互：移出节点 → 恢复默认线宽、节点尺寸，并取消选中
   * -----------------------------------------------------------------------*/
  net.on('blurNode', ({ node }: { node: string | number }) => {
    // 取消“选中态”，文字恢复正常粗细（颜色一直未变）
    net.unselectAll()

    // 节点尺寸还原
    nodeDS.update({ id: node, size: DEFAULT_NODE_SIZE })

    // 相连的边宽度还原
    const eids = net.getConnectedEdges(node)
    if (Array.isArray(eids) && eids.length) {
      edgeDS.update(eids.map(id => ({ id, width: DEFAULT_EDGE_WIDTH })))
    }
  })
}

/** ----------------------------------------------------------------------------
 *  工具：边颜色映射
 *  作用：按关系类型返回统一的颜色
 * ---------------------------------------------------------------------------*/
function edgeColor(type?: string) {
  const map: Record<string, string> = {
    friend: '#34c759', // 朋友
    ally:   '#2eaadc', // 盟友
    enemy:  '#ef4444', // 敌对
    family: '#a78bfa', // 家人
  }
  return map[type || ''] || '#94a3b8'
}

/** ----------------------------------------------------------------------------
 *  生命周期：挂载时初始化；数据变化时重建；卸载时销毁
 * ---------------------------------------------------------------------------*/
onMounted(async () => {
  await nextTick()
  await init()
})

watch(
  () => [props.nodes, props.edges, props.height],
  async () => {
    if (!el.value) return
    if (net && typeof net.destroy === 'function') net.destroy()
    await nextTick()
    await init()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (net && typeof net.destroy === 'function') net.destroy()
  net = null
})
</script>

<style scoped>
/* 主题：暗色模式下容器外观 */
html[data-theme="dark"] .rg-wrap {
  background: var(--vp-c-bg-soft, #0b0f19);
  border-color: var(--c-border, #333);
}
</style>
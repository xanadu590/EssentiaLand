// wiki/.vuepress/composables/useRandomPool.ts
import { ref } from 'vue'
import { withBase } from '@vuepress/client'

export type RandomItem = {
  href: string
  title?: string
  excerpt?: string
}

export function useRandomPool() {
  const pool = ref<RandomItem[]>([])
  const loaded = ref(false)

  /** 加载全站的 random-index.json；失败则回退到“本页站内链接收集” */
  const load = async () => {
    loaded.value = false
    pool.value = []

    // 1) 先尝试全站索引
    try {
      const url = withBase('data/random-index.json')
      const res = await fetch(url, { cache: 'force-cache' })
      if (!res.ok) throw new Error('fetch random-index.json failed')
      const json = await res.json()
      pool.value = normalizeIndex(json)
    } catch (err) {
      console.warn('[Random] useRandomPool: load json failed, fallback to document scan.', err)
      pool.value = collectFromDocument()
    }

    // 去掉当前页自己
    const cur = normalize(location.pathname)
    pool.value = uniqueByHref(
      pool.value.filter(i => normalize(i.href) !== cur)
    )

    loaded.value = true
  }

  /** 随机抽样 N 条（不放回） */
  const sample = (n: number): RandomItem[] => {
    const arr = pool.value.slice()
    const out: RandomItem[] = []
    while (arr.length && out.length < n) {
      const idx = Math.floor(Math.random() * arr.length)
      out.push(arr.splice(idx, 1)[0])
    }
    return out
  }

  /** 将站内 path 变成最终可跳转 href（加 base） */
  const resolveLink = (p: string) => withBase(ensureLeadingSlash(p))

  return {
    pool,
    loaded,
    load,
    sample,
    resolveLink,
  }
}

/* ================= 工具 ================ */

function normalizeIndex(json: any): RandomItem[] {
  if (!json) return []
  if (Array.isArray(json?.pages)) {
    return (json.pages as any[])
      .map(i => ({
        href: ensureLeadingSlash(String(i.path ?? i.link ?? '')),
        title: i?.title ?? '',
        excerpt: i?.excerpt ?? '',
      }))
      .filter(i => /\.html$/.test(i.href))
  }
  if (Array.isArray(json)) {
    return (json as any[])
      .map(i => ({
        href: ensureLeadingSlash(String(i.path ?? i.link ?? '')),
        title: i?.title ?? '',
        excerpt: i?.excerpt ?? '',
      }))
      .filter(i => /\.html$/.test(i.href))
  }
  return []
}

function collectFromDocument(): RandomItem[] {
  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'))
  const sameOrigin = anchors.filter(a => {
    try {
      const u = new URL(a.href, location.href)
      return u.origin === location.origin && /\.html$/.test(u.pathname)
    } catch { return false }
  })
  const mapped = sameOrigin.map(a => ({
    href: a.getAttribute('href') || a.href,
    title: (a.textContent || '').trim(),
  }))
  return uniqueByHref(
    mapped
      .map(i => ({ ...i, href: normalize(i.href) }))
      .filter(i => /\.html$/.test(i.href))
  )
}

function uniqueByHref(list: RandomItem[]): RandomItem[] {
  const m = new Map<string, RandomItem>()
  list.forEach(i => {
    const key = normalize(i.href)
    if (!m.has(key)) m.set(key, { ...i, href: key })
  })
  return [...m.values()]
}

function ensureLeadingSlash(p: string) { return p.startsWith('/') ? p : `/${p}` }
function normalize(href: string): string {
  try { return new URL(href, location.href).pathname } catch { return href }
}
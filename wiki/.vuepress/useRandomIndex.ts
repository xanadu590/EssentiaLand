// .vuepress/client/useRandomIndex.ts
// 作用：加载站内“随机文章索引”（random-index.json），并提供抽样工具。
// 只在客户端运行；SSR 时不触发网络请求。

import { withBase } from '@vuepress/client'   // ★ 新增：带上 base 前缀

// 保持你原来的类型（对外仍暴露 link 字段）
export type RandomItem = {
  title: string
  link: string          // 继续用 link，不改外部调用
  excerpt?: string
}

let CACHE: RandomItem[] | null = null

// ★ 改造：适配我们自建的 random-index.json 结构：{ pages: [{title, path, excerpt}] }
function normalizeIndex(json: any): RandomItem[] {
  if (!json) return []

  // 新结构：{ pages: [...] }
  if (Array.isArray(json?.pages)) {
    return (json.pages as any[])
      .filter(i => i?.title && i?.path)
      .map(i => ({
        title: i.title,
        // 保持对外字段名仍为 link；真正导航时再 withBase
        link: i.path as string,          // 例如 "/foo/bar.html"
        excerpt: i.excerpt || '',
      }))
  }

  // 旧方案兼容（如果你以后回退到 plugin-search / 其它索引也不至于报错）
  if (Array.isArray(json) && json.length && 'link' in json[0]) {
    return (json as any[])
      .filter(i => i?.title && i?.link)
      .map(i => ({
        title: i.title,
        link: i.link,
        excerpt: i.excerpt || i.headers?.[0]?.title || '',
      }))
  }
  if (Array.isArray(json?.entries)) {
    return (json.entries as any[])
      .filter(i => i?.title && i?.link)
      .map(i => ({
        title: i.title,
        link: i.link,
        excerpt: i.excerpt || '',
      }))
  }

  return []
}

/** 加载索引（只加载一次并缓存） */
export async function loadRandomIndex(): Promise<RandomItem[]> {
  if (CACHE) return CACHE
  if (typeof window === 'undefined') return []

  // ★ 现在只读我们生成的 random-index.json
  const url = withBase('random-index.json')

  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json()
    const list = normalizeIndex(json)
    CACHE = list
    return list
  } catch {
    // 兜底：失败返回空
    CACHE = []
    return CACHE
  }
}

/** 从索引中抽一个随机项；可传入排除集合避免最近重复 */
export function pickRandom(
  list: RandomItem[],
  exclude: Set<string> = new Set()
): RandomItem | null {
  const candidates = list.filter(i => !exclude.has(i.link))
  const pool = candidates.length ? candidates : list
  if (!pool.length) return null
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
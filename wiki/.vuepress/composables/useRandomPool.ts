// wiki/.vuepress/composables/useRandomPool.ts
import { ref } from 'vue'
import { withBase } from '@vuepress/client'

/** 调试开关（排查用；上线可设为 false） */
const DEBUG = true
const TAG = '[RandomPool]'

export type RandomItem = {
  href: string
  title?: string
  excerpt?: string
}

/**
 * 统一：从多个可能的 URL 拉取 random-index.json（带版本参数）
 * - 加上 ?v= 构建版本，强制绕过浏览器/CDN 缓存
 * - “开发”通过 hostname 判断（不依赖 env），每次请求都加时间戳
 * - “生产”尽量用 <meta> 注入的 build-rev / build-time；没有则回退为时间戳
 */
function makeVersionedUrl(raw: string): string {
  // 1) 判断是否本地开发：不依赖 env，仅看 hostname
  const host = location.hostname
  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local')

  // 2) 获取一个“构建版本号”
  //    - 优先从 <meta name="build-rev" content="..."> 或 <meta name="build-time"> 获取（可选）
  //    - 否则回退到时间戳
  const metaRev = document.querySelector('meta[name="build-rev"]') as HTMLMetaElement | null
  const metaTime = document.querySelector('meta[name="build-time"]') as HTMLMetaElement | null
  const buildVersion = (metaRev?.content || metaTime?.content || String(Date.now())).trim()

  // 3) DEV：每次都用 Date.now()；PROD：用构建版本（稳定，部署即更新）
  const ver = isLocal ? String(Date.now()) : buildVersion

  // 4) 安全地把 ?v= 挂上去
  try {
    const u = new URL(raw, location.origin)
    u.searchParams.set('v', ver)
    return u.pathname + u.search
  } catch {
    const sep = raw.includes('?') ? '&' : '?'
    return `${raw}${sep}v=${ver}`
  }
}

export function useRandomPool() {
  const pool = ref<RandomItem[]>([])
  const loaded = ref(false)

  /**
   * 依次尝试多个候选 URL（都带版本参数），哪个能拿到就用哪个
   * - withBase('data/random-index.json')          受 base 影响的路径
   * - '/data/random-index.json'                   站点根路径
   * - 自动剥离第一段 base（如 /demo-0.0.1/ → /）
   */
  const tryFetch = async <T = any>(candidates: string[]): Promise<T | null> => {
    for (const url of candidates) {
      try {
        DEBUG && console.info(TAG, 'fetch try:', url)
        const res = await fetch(url, { cache: 'force-cache' })
        if (!res.ok) {
          DEBUG && console.warn(TAG, `fetch fail ${res.status}:`, url)
          continue
        }
        const json = await res.json()
        DEBUG && console.info(TAG, 'fetch ok:', url)
        return json as T
      } catch (e) {
        DEBUG && console.warn(TAG, 'fetch error:', url, e)
      }
    }
    return null
  }

  const load = async () => {
    loaded.value = false
    pool.value = []

    // A) 组织候选 URL，并统一加 ?v= 版本参数（关键改动①）
    const baseUrl = makeVersionedUrl(withBase('data/random-index.json'))

    // 去掉运行时 base 的简易版本（例如把 /demo-0.0.1/data/random-index.json → /data/random-index.json）
    const stripped = (() => {
      try {
        const u = new URL(baseUrl, location.origin)
        const seg = u.pathname.match(/^\/([^/]+)\/(.*)$/)
        if (seg) {
          const first = seg[1]
          if (/^(demo-[\w.-]+|v[\w.-]+)$/i.test(first)) {
            return makeVersionedUrl(`/${seg[2]}`) // 去掉第一段
          }
        }
      } catch {}
      return null
    })()

    const candidates = Array.from(
      new Set([
        baseUrl,                                 // 受 base 影响 + v
        makeVersionedUrl('/data/random-index.json'), // 站点根 + v
        stripped ?? undefined,                   // 自动剥 base + v
      ].filter(Boolean) as string[])
    )

    // B) 先尝试从 JSON 读全站索引
    const json = await tryFetch<any>(candidates)

    if (json) {
      pool.value = normalizeIndex(json)
      DEBUG && console.info(TAG, 'normalizeIndex ->', pool.value.length)
    } else {
      // C) 全部失败：兜底扫描页面链接
      console.warn(`${TAG} all fetch candidates failed, fallback to document scan.`)

      // 关键改动②：等两帧，确保页面主要内容渲染完再扫，避免“漏抓”
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

      pool.value = collectFromDocument()
      DEBUG && console.info(TAG, 'collectFromDocument ->', pool.value.length)
    }

    // D) 去重
    const beforeUnique = pool.value.length
    pool.value = uniqueByHref(pool.value)
    DEBUG && console.info(TAG, `uniqueByHref: ${beforeUnique} -> ${pool.value.length}`)

    // E) 排除当前页 / 顶层页
    const cur = normalize(location.pathname)
    const beforeFilter = pool.value.length
    pool.value = pool.value.filter(i => {
      const p = normalize(i.href)
      // 只排除真正同页面；避免因为 base 的不同表示而误判
      return !isTopPage(p) && p !== cur && !location.pathname.endsWith(p)
    })
    DEBUG && console.info(TAG, `filter current/top: ${beforeFilter} -> ${pool.value.length} (cur=${cur})`)

    loaded.value = true
  }

  /** 从池中随机抽取 n 条（不放回、不重复） */
  const sample = (n: number): RandomItem[] => {
    const seen = new Set<string>()
    const arr = pool.value.slice()
    const out: RandomItem[] = []
    while (arr.length && out.length < n) {
      const idx = Math.floor(Math.random() * arr.length)
      const item = arr.splice(idx, 1)[0]
      const key = normalize(item.href)
      if (!seen.has(key)) {
        seen.add(key)
        out.push(item)
      }
    }
    DEBUG && console.debug(TAG, `sample(${n}) -> ${out.length}`, out.map(i => i.href))
    return out
  }

  /** 把站内 path 变为最终可跳转的绝对地址（自动加 base） */
  const resolveLink = (p: string) => withBase(ensureLeadingSlash(p))

  return { pool, loaded, load, sample, resolveLink }
}

/* ================= 工具函数（保持原逻辑，补充注释） ================ */

/** 解析 random-index.json 为 RandomItem[]（兼容 {pages:[]} 或数组），并排除顶层页/外链/非 .html */
function normalizeIndex(json: any): RandomItem[] {
  if (!json) return []

  const toItem = (i: any): RandomItem | null => {
    const raw = String(i?.path ?? i?.link ?? '')
    if (!raw) return null
    const href = normalize(raw)
    if (!/\.html$/i.test(href) || isTopPage(href) || href.startsWith('http')) {
      DEBUG && console.debug(TAG, 'skip:', { raw, href })
      return null
    }
    return {
      href,
      title: (i?.title ?? '').trim(),
      excerpt: (i?.excerpt ?? '').trim(),
    }
  }

  const list = Array.isArray(json?.pages)
    ? (json.pages as any[]).map(toItem).filter(Boolean)
    : Array.isArray(json)
    ? (json as any[]).map(toItem).filter(Boolean)
    : []

  DEBUG && console.info(TAG, 'normalizeIndex list =', list.length)
  return uniqueByHref(list as RandomItem[])
}

/** 从文档中收集“本站 .html”链接；排除顶层页 */
function collectFromDocument(): RandomItem[] {
  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'))
  const items = anchors
    .map(a => a.getAttribute('href') || a.href)
    .filter(Boolean)
    .map(h => normalize(String(h)))
    .filter(p => /\.html$/i.test(p) && !p.startsWith('http') && !isTopPage(p))
    .map(p => ({ href: p, title: '', excerpt: '' }))

  DEBUG && console.info(TAG, 'collectFromDocument size =', items.length)
  return uniqueByHref(items)
}

/** 顶层页判定：/、/index.html、/README.html 都认为是首页 */
function isTopPage(p: string): boolean {
  const x = normalize(p)
  return x === '/' || /\/index\.html$/i.test(x) || /\/README\.html$/i.test(x)
}

function uniqueByHref(list: RandomItem[]): RandomItem[] {
  const m = new Map<string, RandomItem>()
  list.forEach(i => {
    const key = normalize(i.href)
    if (!m.has(key)) m.set(key, { ...i, href: key })
  })
  return [...m.values()]
}

function ensureLeadingSlash(p: string) {
  return p.startsWith('/') ? p : `/${p}`
}

/**
 * 标准化为“站内路径”：
 * - 只保留 pathname（去域名）
 * - 剥离已知 base 前缀：
 *    1) 运行时 base：withBase('/')
 *    2) 历史：'/ZenithWorld/'
 *    3) 自动识别：当前 URL 的首段若形如 'demo-*' 或 'v*'，视作 base（如 '/demo-0.0.1/'、'/v1/'）
 * - 最终确保以 '/' 开头
 */
function normalize(href: string): string {
  let path = href
  try {
    path = new URL(href, location.href).pathname
  } catch {}
  path = ensureLeadingSlash(path)

  // 1) 运行时 base（如 '/' 或 '/ZenithWorld/'）
  const runtimeBase = normalizeBase(withBase('/').replace(location.origin, ''))

  // 2) 自动识别当前 URL 的第一段作为潜在 base（demo-*/v*）
  const autoBases: string[] = []
  const seg = location.pathname.match(/^\/([^/]+)\//)
  if (seg) {
    const first = seg[1]
    if (/^(demo-[\w.-]+|v[\w.-]+)$/i.test(first)) {
      autoBases.push(`/${first}/`)
    }
  }

  // 3) 历史手动列举
  const manualBases = ['/ZenithWorld/']

  // 汇总并按长度降序（避免短前缀先剥导致误差）
  const knownBases = [runtimeBase, ...autoBases, ...manualBases]
    .filter(Boolean)
    .map(normalizeBase)
    .sort((a, b) => b.length - a.length)

  for (const b of knownBases) {
    if (b !== '/' && path.startsWith(b)) {
      const old = path
      path = ensureLeadingSlash(path.slice(b.length))
      DEBUG && console.debug(TAG, 'strip base:', b, '=>', old, '->', path)
      break
    }
  }
  return path
}

/** 规范化 base：确保头尾都有斜杠 */
function normalizeBase(b: string): string {
  if (!b) return '/'
  let x = b
  if (!x.startsWith('/')) x = `/${x}`
  if (!x.endsWith('/')) x = `${x}/`
  return x
}
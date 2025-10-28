<template>
  <div class="qa-card" role="group" aria-label="问答卡">

    <!-- 问题 -->
    <div class="qa-row qa-question">
      <span class="qa-badge">Q</span>
          <div class="qa-text-row">
        <div class="qa-text" v-html="cur?.q"></div>
        <button class="qa-btn dice-btn" type="button" @click="next" title="换一题">
          🎲
        </button>
      </div>
    </div>

    <!-- 答案（可遮罩） -->
    <div class="qa-row qa-answer">
      <span class="qa-badge qa-badge-a">A</span>

      <div class="qa-answer-box">
        <!-- 遮罩：未揭示时显示 -->
        <button
          v-if="!revealed"
          class="qa-mask"
          type="button"
          @click="revealed = true"
          aria-label="点击查看答案"
        >
          点击查看答案
        </button>

        <!-- 真正答案内容 -->
        <div class="qa-text" v-show="revealed" v-html="cur?.a"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 用法：
 * <QACard :bank="[{ q:'问题', a:'答案' }, ...]" />
 * - 题库仅来自当前页面传入的 props（不会读全局）
 * - “换一题”会在当前 bank 内随机切换
 */
import { ref, onMounted, watch } from 'vue'

type QAItem = { q: string; a: string }

const props = withDefaults(defineProps<{
  /** 题库：仅当前页面传入，当前页面内使用 */
  bank: QAItem[]
  /** 初始是否直接显示答案（默认 false = 遮住，点击后显示） */
  revealInitially?: boolean
}>(), {
  revealInitially: false,
})

const cur = ref<QAItem | null>(null)
const revealed = ref<boolean>(props.revealInitially)
const pool = ref<QAItem[]>([])
const used = ref<number>(0)

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function refill() {
  pool.value = shuffle(props.bank || [])
  used.value = 0
}

function next() {
  if (!pool.value.length) refill()
  if (!pool.value.length) { cur.value = null; return } // 空题库
  if (used.value >= pool.value.length) refill()
  cur.value = pool.value[used.value++]
  revealed.value = props.revealInitially
}

onMounted(next)
watch(() => props.bank, () => { refill(); next() }, { deep: true })
</script>

<style scoped>
/* ============ 可调样式变量（看注释改数值即可） ============ */
/* 卡片整体内边距 */
.qa-card{
  --qa-pad: 14px;

  /* Q / A 圆角标尺寸与文字 */
  --qa-badge-size: 22px;
  --qa-badge-font: 12px;

  /* Q 与文本的水平间距、两行之间的垂直间距 */
  --qa-col-gap: 10px;
  --qa-row-gap: 10px;

  /* 标题行(问题)与答案行之间的距离（更直观地单独控制） */
  --qa-q2a-gap: 12px;

  /* 遮罩占位尺寸（未揭示时按钮区域） */
  --qa-mask-min-h: 26px;     /* 高度 */
  --qa-mask-pad: 0px 0px;  /* 内边距 */
  --qa-mask-font: 14px;      /* 字号 */
  --qa-mask-radius: 10px;    /* 圆角 */

  /* 第三行（答案块）包裹色块（明/暗） */
  --qa-ans-bg: rgba(0,0,0,.05);
  --qa-ans-bg-dark: rgba(255,255,255,.08);

  /* 文本颜色（明/暗主题走变量） */
  color: var(--c-text, #111);

  box-sizing: border-box;
  width: 100%;
  padding: 0;               /* var(--qa-pad); */
  border: none;             /* 1px solid var(--c-border, #e5e7eb); */
  background: none;         /* var(--vp-c-bg-soft, var(--c-bg, #fff)); */
  border-radius: 14px;
  box-shadow: none;         /* 0 2px 12px rgba(0,0,0,.05); */
  margin: 16px 0;
}

/* 顶部工具区（换一题） */
.qa-toolbar{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 6px;
}
.qa-btn{
  border: 1px solid var(--c-border, #e5e7eb);
  background: var(--vp-c-bg-soft, var(--c-bg, #fff));
  color: inherit;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
}

/* 🎲骰子按钮样式 */
.dice-btn {
  border: none;
  background: transparent;
  font-size: 1.6rem;     /* ✅ 放大尺寸 */
  line-height: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 2px;
}

.dice-btn:hover {
  transform: rotate(20deg) scale(1.2);  /* ✅ 悬停有轻微旋转和放大 */
}

/* 暗色模式下稍微提亮 */
html[data-theme="dark"] .dice-btn {
  color: #e5e5e5;
}

/* 问/答两行 */
.qa-row{
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: var(--qa-col-gap);
  align-items: center;
}
.qa-row + .qa-row{
  margin-top: var(--qa-row-gap);
}
/* 问题与答案之间的额外间距 */
.qa-question + .qa-answer{
  margin-top: var(--qa-q2a-gap);
}

/* Q/A 圆角标 */
.qa-badge{
  display: inline-grid;
  place-items: center;
  width: var(--qa-badge-size);
  height: var(--qa-badge-size);
  border-radius: 9999px;
  font-weight: 700;
  font-size: var(--qa-badge-font);
  color: #fff;
  background: var(--c-brand, #3eaf7c);
  user-select: none;
}
.qa-badge-a{
  background: #64748b; /* slate */
}

/* 文本块 */
.qa-text{
  line-height: 1.6;
  word-break: break-word;
}

.qa-text-row {
  display: flex;
  justify-content: space-between; /* ✅ 问题靠左，按钮靠右 */
  align-items: center;
  gap: 8px;
}

/* 答案容器带色块背景（随主题变） */
.qa-answer .qa-answer-box{
  background: var(--qa-ans-bg);
  border-radius: 10px;
  padding: 8px 10px;
}
html[data-theme="dark"] .qa-card .qa-answer .qa-answer-box{
  background: var(--qa-ans-bg-dark);
}

/* 遮罩按钮（占位可调） */
.qa-mask{
  width: 100%;
  min-height: var(--qa-mask-min-h);
  padding: var(--qa-mask-pad);
  border-radius: var(--qa-mask-radius);
  border: 1px dashed var(--c-border, #d3d8df);
  background: transparent;
  color: var(--c-text, #111);
  font-size: var(--qa-mask-font);
  cursor: pointer;
}
html[data-theme="dark"] .qa-card .qa-mask{
  color: var(--c-text, #e5e5e5);
  border-color: #3a3a3a;
}
</style>
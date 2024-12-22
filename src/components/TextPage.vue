<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('text.title') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4 mx-auto space-y-4" :class="{ 'max-w-4xl': isCompactMode }">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <el-tabs v-model="currentTab" class="dark-mode-tabs" type="border-card">
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.key"
              :label="t(tab.title)"
              :name="tab.key"
            />
          </el-tabs>

          <!-- 字符替换 Tab -->
          <div v-if="currentTab === 'replace'" class="p-6 space-y-4">
            <!-- 输入区域 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('text.replace.input') }}
                </label>
              </div>
              <textarea
                v-model="inputText"
                class="w-full min-h-[160px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-blue-500 dark:focus:ring-blue-400"
                :style="{ height: textareaHeight }"
                @input="adjustTextareaHeight"
                :placeholder="t('text.replace.inputPlaceholder')"
              ></textarea>
              
              <!-- 输入框下方的控制区域 -->
              <div class="flex items-center justify-between">
                <!-- 左侧正则模式切换 -->
                <button
                  @click="toggleRegexMode"
                  class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                  :class="[
                    isRegexMode 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  ]"
                >
                  <div class="flex items-center space-x-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span class="text-sm">{{ t('text.replace.regexMode') }}</span>
                  </div>
                </button>

                <!-- 右侧重置按钮，仅在有输入内容时显示 -->
                <div v-if="inputText">
                  <div v-if="confirmingReset" class="flex items-center space-x-2">
                    <button
                      @click="handleReset"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                    >{{ t('text.confirmReset') }}</button>
                    <button
                      @click="confirmingReset = false"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >{{ t('text.cancel') }}</button>
                  </div>
                  <button
                    v-else
                    @click="confirmingReset = true"
                    class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                           bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400"
                  >{{ t('text.reset') }}</button>
                </div>
              </div>
            </div>

            <!-- 替换设置 -->
            <div class="space-y-4">
              <!-- 查找内容 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('text.replace.from') }}
                  </label>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="() => { fromOptions.isNewline = !fromOptions.isNewline; handleNewlineChange() }"
                      class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none text-sm"
                      :class="[
                        fromOptions.isNewline 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ t('text.replace.newline') }}
                    </button>
                    <button
                      @click="() => { fromOptions.isNumber = !fromOptions.isNumber; handleNumberChange() }"
                      class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none text-sm"
                      :class="[
                        fromOptions.isNumber 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ t('text.replace.number') }}
                    </button>
                    <button
                      @click="() => { fromOptions.isLetter = !fromOptions.isLetter; handleLetterChange() }"
                      class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none text-sm"
                      :class="[
                        fromOptions.isLetter 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ t('text.replace.letter') }}
                    </button>
                  </div>
                </div>
                <input
                  v-model="replaceFrom"
                  type="text"
                  class="w-full p-2 border rounded-lg transition-colors"
                  :class="[
                    fromOptions.isNewline || fromOptions.isNumber || fromOptions.isLetter
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  ]"
                  :placeholder="t('text.replace.fromPlaceholder')"
                  :readonly="fromOptions.isNewline || fromOptions.isNumber || fromOptions.isLetter"
                />
              </div>

              <!-- 替换为 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('text.replace.to') }}
                  </label>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="() => { toOptions.isNewline = !toOptions.isNewline; handleToNewlineChange() }"
                      class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none text-sm"
                      :class="[
                        toOptions.isNewline 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ t('text.replace.newline') }}
                    </button>
                    <button
                      @click="() => { toOptions.isQuote = !toOptions.isQuote; handleToQuoteChange() }"
                      class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none text-sm"
                      :class="[
                        toOptions.isQuote 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      ]"
                    >
                      {{ t('text.replace.quote') }}
                    </button>
                  </div>
                </div>
                <input
                  v-model="replaceTo"
                  type="text"
                  class="w-full p-2 border rounded-lg transition-colors"
                  :class="[
                    toOptions.isNewline || toOptions.isQuote
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  ]"
                  :placeholder="t('text.replace.toPlaceholder')"
                  :readonly="toOptions.isNewline || toOptions.isQuote"
                />
              </div>
            </div>

            <!-- 操作按钮区域 -->
            <div class="flex justify-between">
              <!-- 左侧执行替换按钮 -->
              <button
                @click="handleReplace"
                class="px-4 py-2 rounded-lg transition-colors focus:outline-none
                       bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                       text-white"
              >
                {{ t('text.replace.execute') }}
              </button>
            </div>

            <!-- 输出区域 -->
            <div v-if="outputText">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('text.output') }}
                </label>
                <button
                  @click="copyOutput"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-600 dark:text-gray-300"
                >
                  {{ t('text.copy') }}
                </button>
              </div>
              <textarea
                v-model="outputText"
                readonly
                class="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- 基础功能 Tab -->
          <div v-else class="p-6 space-y-4">
            <!-- 原有的基础功能内容 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('text.input') }}
              </label>
              <textarea
                v-model="inputText"
                class="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-blue-500 dark:focus:ring-blue-400"
                :placeholder="t('text.input')"
              ></textarea>
            </div>

            <!-- 功能按钮组 -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(func, key) in textFunctions"
                :key="key"
                @click="func.action"
                class="px-4 py-2 rounded-lg transition-colors focus:outline-none
                       bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                       text-white"
              >
                {{ t(`text.functions.${key}`) }}
              </button>
            </div>

            <!-- 输出区域 -->
            <div v-if="outputText">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('text.output') }}
                </label>
                <button
                  @click="copyOutput"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-600 dark:text-gray-300"
                >
                  {{ t('text.copy') }}
                </button>
              </div>
              <textarea
                v-model="outputText"
                readonly
                class="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <!-- 重置按钮 -->
            <div class="flex justify-end" v-if="inputText || outputText">
              <div v-if="confirmingReset" class="flex items-center space-x-2">
                <button
                  @click="handleReset"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                >{{ t('text.confirmReset') }}</button>
                <button
                  @click="confirmingReset = false"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                >{{ t('text.cancel') }}</button>
              </div>
              <button
                v-else
                @click="confirmingReset = true"
                class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                       bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400"
              >{{ t('text.reset') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ElTabs, ElTabPane } from 'element-plus'
import { useDisplayMode } from '../composables/useDisplayMode'

const { t } = useI18n()
const { isCompactMode } = useDisplayMode()

const currentTab = ref('replace')
const tabs = [
  { key: 'replace', title: 'text.replace.title' }
]

const inputText = ref('')
const outputText = ref('')
const confirmingReset = ref(false)

// 替换功能相关状态
const replaceFrom = ref('')
const replaceTo = ref('')
const fromOptions = ref({
  isNewline: false,
  isNumber: false,
  isLetter: false
})
const toOptions = ref({
  isNewline: false,
  isQuote: false
})
const isRegexMode = ref(false)

const textareaHeight = ref('160px')

// 自动调整文本框高度
const adjustTextareaHeight = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement
  textarea.style.height = '160px' // 重置高度
  const scrollHeight = textarea.scrollHeight
  textarea.style.height = scrollHeight + 'px'
  textareaHeight.value = scrollHeight + 'px'
}

// 切换正则模式
const toggleRegexMode = () => {
  isRegexMode.value = !isRegexMode.value
}

// 处理查找内容换行符选项变化
const handleNewlineChange = () => {
  if (fromOptions.value.isNewline) {
    replaceFrom.value = '\\r?\\n'
    isRegexMode.value = true
    fromOptions.value.isNumber = false
    fromOptions.value.isLetter = false
  }
}

// 处理查找内容数字选项变化
const handleNumberChange = () => {
  if (fromOptions.value.isNumber) {
    replaceFrom.value = '\\d+'
    isRegexMode.value = true
    fromOptions.value.isNewline = false
    fromOptions.value.isLetter = false
  }
}

// 处理查找内容英文选项变化
const handleLetterChange = () => {
  if (fromOptions.value.isLetter) {
    replaceFrom.value = '[a-zA-Z]+'
    isRegexMode.value = true
    fromOptions.value.isNewline = false
    fromOptions.value.isNumber = false
  }
}

// 处理替换为换行符选项变化
const handleToNewlineChange = () => {
  if (toOptions.value.isNewline) {
    replaceTo.value = '\\n'
    toOptions.value.isQuote = false
  }
}

// 处理替换为引号选项变化
const handleToQuoteChange = () => {
  if (toOptions.value.isQuote) {
    replaceTo.value = "'$&'"
    toOptions.value.isNewline = false
  }
}

// 替换功能
const handleReplace = () => {
  if (!inputText.value || !replaceFrom.value) return

  try {
    let searchValue: string | RegExp = replaceFrom.value
    let replaceValue = replaceTo.value

    // 处理替换内容
    if (toOptions.value.isNewline) {
      // 如果是换行符替换
      replaceValue = replaceTo.value.replace(/\\n/g, '\n')
    } else if (toOptions.value.isQuote) {
      // 如果是引号包裹,先处理搜索值
      let searchValue: string | RegExp
      if (isRegexMode.value || fromOptions.value.isNewline || 
          fromOptions.value.isNumber || fromOptions.value.isLetter) {
        searchValue = new RegExp(`(${replaceFrom.value})`, 'g')
      } else {
        // 非正则模式，转义特殊字符
        searchValue = new RegExp(`(${replaceFrom.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
      }
      // 先替换中间的匹配项
      let result = inputText.value.replace(searchValue, "'$1'")
      
      outputText.value = "'" +  result + "'"
      return
    }

    // 如果是正则模式或特殊选项,使用正则表达式
    if (isRegexMode.value || fromOptions.value.isNewline || 
        fromOptions.value.isNumber || fromOptions.value.isLetter) {
      searchValue = new RegExp(replaceFrom.value, 'g')
    } else {
      // 非正则模式下转义特殊字符并使用全局替换
      searchValue = new RegExp(replaceFrom.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    }

    const result = inputText.value.replace(searchValue, replaceValue)
    
    // 检查替换结果是否与原文相同
    if (result === inputText.value) {
      ElMessage({
        message: t('text.replace.noMatch'),
        type: 'warning',
        duration: 2000
      })
    }
    
    outputText.value = result
  } catch (err) {
    ElMessage.error(t('text.replace.error'))
  }
}

// 基础文本处理函数
const textFunctions = {
  trim: {
    action: () => {
      outputText.value = inputText.value.trim()
    }
  },
  uppercase: {
    action: () => {
      outputText.value = inputText.value.toUpperCase()
    }
  },
  lowercase: {
    action: () => {
      outputText.value = inputText.value.toLowerCase()
    }
  },
  reverse: {
    action: () => {
      outputText.value = inputText.value.split('').reverse().join('')
    }
  },
  length: {
    action: () => {
      outputText.value = `字符数: ${inputText.value.length}`
    }
  }
}

// 复制输出文本
const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage({
      message: t('text.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    ElMessage({
      message: t('text.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 重置
const handleReset = () => {
  inputText.value = ''
  outputText.value = ''
  replaceFrom.value = ''
  replaceTo.value = ''
  fromOptions.value = {
    isNewline: false,
    isNumber: false,
    isLetter: false
  }
  toOptions.value = {
    isNewline: false,
    isQuote: false
  }
  isRegexMode.value = false
  textareaHeight.value = '160px'
  confirmingReset.value = false
}
</script>

<style scoped>
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

:deep(.dark-mode-tabs.el-tabs) {
  /* 移除默认边框 */
  &.el-tabs--border-card {
    background: transparent;
    border: none;
  }

  .el-tabs__header {
    background: transparent;
    border: none;
    margin: 0;
  }

  .el-tabs__nav {
    border: none !important;
  }

  /* Tab 样式 */
  .el-tabs__item {
    height: 48px;
    line-height: 48px;
    padding: 0 24px;
    font-size: 14px;
    color: rgba(75, 85, 99, 0.7);
    transition: all 0.3s ease;
    border: none;
    margin-right: 0;
    position: relative;
    
    &:hover {
      color: var(--el-color-primary);
    }
    
    &.is-active {
      color: var(--el-color-primary);
      background: transparent;

      /* 活动状态下的底部指示条 */
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--el-color-primary);
      }
    }
  }

  /* 内容区域样式 */
  .el-tabs__content {
    padding: 0;
  }
}

/* 暗黑模式特定样式 */
:deep(.dark .dark-mode-tabs.el-tabs) {
  .el-tabs__item {
    color: rgba(255, 255, 255, 0.7);
    
    &:hover {
      color: var(--el-color-primary);
    }
    
    &.is-active {
      color: var(--el-color-primary);
    }
  }
}
</style> 
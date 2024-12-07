<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClipboard, useDark } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import * as monaco from 'monaco-editor'

const { t } = useI18n()
const { copy } = useClipboard()
const isDark = useDark()

const jsonInput = ref('')
const errorMessage = ref('')
const confirmingAction = ref<string | null>(null)
const showLineNumbers = ref(true)
const isCompressed = ref(false)

// 分别为输入和输出创建引用
const inputEditorContainer = ref<HTMLElement | null>(null)
const outputEditorContainer = ref<HTMLElement | null>(null)
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 创建编辑器的通用函数
const createEditor = (container: HTMLElement, value: string, isReadOnly = false) => {
  return monaco.editor.create(container, {
    value,
    language: 'json',
    theme: isDark.value ? 'vs-dark' : 'vs',
    automaticLayout: true,
    minimap: { enabled: false },
    lineNumbers: showLineNumbers.value ? 'on' : 'off',
    scrollBeyondLastLine: false,
    tabSize: 2,
    fontSize: 14,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    renderWhitespace: 'selection',
    folding: true,
    formatOnPaste: true,
    formatOnType: true,
    readOnly: isReadOnly
  })
}

// 初始化编辑器
const initializeEditors = () => {
  if (inputEditorContainer.value) {
    inputEditor = createEditor(inputEditorContainer.value, '')
    // 监听输入变化
    inputEditor.onDidChangeModelContent(() => {
      const value = inputEditor?.getValue() || ''
      jsonInput.value = value
      try {
        const parsed = JSON.parse(value)
        errorMessage.value = ''
        // 更新输出编辑器
        const formatted = isCompressed.value
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, 2)
        outputEditor?.setValue(formatted)
      } catch (e) {
        errorMessage.value = (e as Error).message
        outputEditor?.setValue('')
      }
    })
  }

  if (outputEditorContainer.value) {
    outputEditor = createEditor(outputEditorContainer.value, '', true)
  }
}

// 监听暗色模式变化
watch(isDark, (newValue) => {
  const theme = newValue ? 'vs-dark' : 'vs'
  monaco.editor.setTheme(theme)
})

// 监听行号显示变化
watch(showLineNumbers, (newValue) => {
  const lineNumbers = newValue ? 'on' : 'off'
  inputEditor?.updateOptions({ lineNumbers })
  outputEditor?.updateOptions({ lineNumbers })
})

// 复制内容
const copyOutput = async () => {
  try {
    const outputValue = outputEditor?.getValue()
    if (!outputValue) throw new Error('No content to copy')
    await copy(outputValue)
    ElMessage({
      message: t('json.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    ElMessage({
      message: t('json.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 重置内容
const resetContent = () => {
  inputEditor?.setValue('')
  outputEditor?.setValue('')
  jsonInput.value = ''
  errorMessage.value = ''
  confirmingAction.value = null
}

// 切换压缩/展开状态
const toggleJsonFormat = () => {
  if (!jsonInput.value.trim()) return
  isCompressed.value = !isCompressed.value
  
  try {
    const parsed = JSON.parse(jsonInput.value)
    const formatted = isCompressed.value
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, 2)
    outputEditor?.setValue(formatted)
  } catch (e) {
    errorMessage.value = (e as Error).message
  }
}

onMounted(() => {
  initializeEditors()
})

onBeforeUnmount(() => {
  inputEditor?.dispose()
  outputEditor?.dispose()
})
</script>

<template>
  <div class="h-full flex flex-col p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('menu.devTools.json') }}</h1>
    
    <div class="flex-1 flex flex-col gap-4">
      <!-- 按钮组 -->
      <div class="flex justify-between">
        <div class="flex gap-2">
          <!-- 压缩/展开按钮 -->
          <button
            @click="toggleJsonFormat"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              isCompressed
                ? 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            ]"
          >
            {{ t(isCompressed ? 'json.expand' : 'json.compress') }}
          </button>

          <!-- 行号显示按钮 -->
          <button
            @click="showLineNumbers = !showLineNumbers"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              showLineNumbers
                ? 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            ]"
          >
            {{ t('json.showLineNumbers') }}
          </button>
        </div>
        
        <!-- 复制和重置按钮 -->
        <div class="flex gap-2">
          <!-- 重置按钮组 -->
          <div class="flex items-center">
            <div v-if="jsonInput && confirmingAction === 'reset'" class="flex items-center space-x-2">
              <button
                @click="resetContent"
                class="px-4 py-1.5 text-sm rounded-lg transition-colors
                       bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
              >{{ t('json.confirmReset') }}</button>
              <button
                @click="cancelAction"
                class="px-4 py-1.5 text-sm rounded-lg transition-colors
                       bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              >{{ t('common.cancel') }}</button>
            </div>
            <button
              v-else-if="jsonInput"
              @click="confirmingAction = 'reset'"
              class="px-4 py-1.5 text-sm rounded-lg transition-colors"
              :class="[
                confirmingAction === 'reset'
                  ? 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400'
              ]"
            >{{ t('common.reset') }}</button>
          </div>

          <!-- 复制按钮 -->
          <button
            @click="copyOutput"
            class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                   dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg 
                   transition-colors focus:outline-none"
          >
            {{ t('common.copy') }}
          </button>
        </div>
      </div>
      
      <!-- 编辑器区域 -->
      <div class="flex-1 grid grid-cols-2 gap-4">
        <!-- 输入编辑器 -->
        <div 
          ref="inputEditorContainer" 
          class="rounded-lg border overflow-hidden"
          :class="[
            errorMessage 
              ? 'border-red-200 dark:border-red-800'
              : 'border-gray-200 dark:border-gray-700'
          ]"
        ></div>
        
        <!-- 输出编辑器 -->
        <div 
          ref="outputEditorContainer" 
          class="rounded-lg border overflow-hidden border-gray-200 dark:border-gray-700"
        ></div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="errorMessage" class="text-red-500 dark:text-red-400 text-sm">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style>
/* Monaco 编辑器容器样式 */
.monaco-editor {
  padding: 8px 0;
}

/* 确保编辑器填充容器 */
.monaco-editor .overflow-guard {
  width: 100% !important;
  height: 100% !important;
}

/* 编辑器网格布局 */
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>

</```rewritten_file>
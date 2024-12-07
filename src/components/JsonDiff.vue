<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <button
          @click="toggleCompact"
          class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
          :class="[
            isCompressed
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          ]"
        >
          <div class="flex items-center space-x-1.5">
            <el-icon class="w-4 h-4"><Fold /></el-icon>
            <span class="text-sm">{{ t('json.compress') }}</span>
          </div>
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          v-if="diffResult"
          @click="copyDiff"
          class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                 text-gray-600 dark:text-gray-300"
        >
          {{ t('json.copy') }}
        </button>
        <button
          @click="resetContent"
          class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                 bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400
                 hover:bg-red-100 dark:hover:bg-red-900/50"
        >
          {{ t('json.reset') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <div class="flex items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('json.originalJson') }}
          </label>
        </div>
        <div class="min-h-[200px]">
          <Codemirror
            v-model="originalJson"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @change="handleJsonChange"
            class="h-full mt-3"
          />
        </div>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('json.modifiedJson') }}
          </label>
        </div>
        <div class="min-h-[200px]">
          <Codemirror
            v-model="modifiedJson"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @change="handleJsonChange"
            class="h-full mt-3"
          />
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('json.diffResult') }}
        </label>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('json.diffLegend') }}:</span>
          <span class="text-xs px-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400">{{ t('json.removed') }}</span>
          <span class="text-xs px-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400">{{ t('json.added') }}</span>
        </div>
      </div>
      <div class="min-h-[200px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <pre v-if="!error" class="whitespace-pre-wrap text-sm" v-html="diffResult"></pre>
        <pre v-else class="whitespace-pre-wrap text-sm text-red-500">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElIcon } from 'element-plus'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { lineNumbers } from '@codemirror/view'
import { EditorView } from '@codemirror/view'
import { Fold } from '@element-plus/icons-vue'
import * as DiffMatchPatch from 'diff-match-patch'

const { t } = useI18n()

const originalJson = ref('')
const modifiedJson = ref('')
const diffResult = ref('')
const error = ref('')
const isCompressed = ref(false)

const dmp = new DiffMatchPatch.diff_match_patch()

const extensions = computed(() => [
  json(),
  lineNumbers(),
  EditorView.theme({
    '&': {
      backgroundColor: 'transparent !important',
      height: '100%'
    },
    '.cm-gutters': {
      backgroundColor: 'transparent !important',
      borderRight: '1px solid var(--el-border-color-lighter)'
    },
    '.cm-content': {
      height: '100%',
      minHeight: '200px'
    }
  })
])

const formatJson = (jsonStr: string): string => {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, isCompressed.value ? 0 : 2)
  } catch (e) {
    throw new Error(t('json.invalidJson'))
  }
}

const handleJsonChange = () => {
  try {
    if (!originalJson.value.trim() || !modifiedJson.value.trim()) {
      diffResult.value = ''
      error.value = ''
      return
    }

    const original = formatJson(originalJson.value)
    const modified = formatJson(modifiedJson.value)

    const diffs = dmp.diff_main(original, modified)
    dmp.diff_cleanupSemantic(diffs)

    let htmlResult = ''
    for (const [type, text] of diffs) {
      const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

      if (type === -1) {
        htmlResult += `<span class="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400">${escapedText}</span>`
      } else if (type === 1) {
        htmlResult += `<span class="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400">${escapedText}</span>`
      } else {
        htmlResult += `<span class="text-gray-900 dark:text-gray-100">${escapedText}</span>`
      }
    }

    diffResult.value = htmlResult
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    diffResult.value = ''
  }
}

const toggleCompact = () => {
  isCompressed.value = !isCompressed.value
  handleJsonChange()
}

const resetContent = () => {
  originalJson.value = ''
  modifiedJson.value = ''
  diffResult.value = ''
  error.value = ''
}

const copyDiff = async () => {
  try {
    // 移除HTML标签后再复制
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = diffResult.value
    await navigator.clipboard.writeText(tempDiv.textContent || '')
    ElMessage.success(t('json.copySuccess'))
  } catch (e) {
    ElMessage.error(t('json.copyError'))
  }
}
</script>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
  min-height: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

:deep(.cm-editor.cm-focused) {
  outline: none;
  border-color: var(--el-color-primary);
}

:deep(.dark .cm-editor) {
  color: var(--el-text-color-primary);
}

:deep(.cm-scroller) {
  min-height: 200px !important;
}

:deep(.cm-editor .cm-content) {
  margin: 0;
  padding: 4px 8px;
  text-align: left;
}

:deep(.cm-line) {
  padding: 0;
  text-align: left;
}

pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  line-height: 1.5;
  overflow-x: auto;
}
</style> 
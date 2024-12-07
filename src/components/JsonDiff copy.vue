<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <button
        @click="handleJsonChange"
        class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
               bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
               text-white"
      >
        {{ t('json.format') }}
      </button>

      <div v-if="originalJson || modifiedJson" class="inline-block">
        <div v-if="confirmingClear" class="flex items-center space-x-2">
          <button
            @click="resetContent"
            class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                   bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
          >
            {{ t('json.confirmReset') }}
          </button>
          <button
            @click="confirmingClear = false"
            class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                   bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {{ t('json.cancel') }}
          </button>
        </div>
        <button
          v-else
          @click="confirmingClear = true"
          class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                 bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400
                 hover:bg-red-100 dark:hover:bg-red-900/50"
        >
          {{ t('json.reset') }}
        </button>
      </div>
    </div>

    <div class="h-[500px]" ref="editorContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { json } from '@codemirror/lang-json'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { EditorView as CMEditorView } from '@codemirror/view'
import { MergeView } from '@codemirror/merge'

const { t } = useI18n()
const originalJson = ref('')
const modifiedJson = ref('')
const error = ref('')
const confirmingClear = ref(false)
const editorContainer = ref<HTMLElement | null>(null)
let view: EditorView | null = null

const formatJson = (jsonStr: string): string => {
  try {
    if (!jsonStr.trim()) return ''
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch (e) {
    throw new Error(t('json.invalidJson'))
  }
}

const createMergeView = () => {
  if (!editorContainer.value) return

  // 清除现有的编辑器
  if (view) {
    view.destroy()
  }

  const mergeViewConfig = new MergeView({
    a: {
      doc: originalJson.value,
      extensions: [
        basicSetup,
        json(),
        EditorState.tabSize.of(2),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            padding: "8px"
          }
        })
      ]
    },
    b: {
      doc: modifiedJson.value,
      extensions: [
        basicSetup,
        json(),
        EditorState.tabSize.of(2),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            padding: "8px"
          }
        })
      ]
    },
    parent: editorContainer.value,
    revertControls: true,
    highlightChanges: true,
    collapseUnchanged: {
      margin: 50,
      minSize: 30
    }
  })

  view = mergeViewConfig.view
}

const resetContent = () => {
  originalJson.value = ''
  modifiedJson.value = ''
  error.value = ''
  confirmingClear.value = false
  createMergeView()
}

const handleJsonChange = () => {
  try {
    if (originalJson.value.trim()) {
      originalJson.value = formatJson(originalJson.value)
    }
    if (modifiedJson.value.trim()) {
      modifiedJson.value = formatJson(modifiedJson.value)
    }
    createMergeView()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

onMounted(() => {
  nextTick(() => {
    createMergeView()
  })
})
</script>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
  max-height: 500px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

:deep(.cm-scroller) {
  overflow: auto;
}

:deep(.cm-content) {
  padding-left: 8px !important;
}

:deep(.cm-merge) {
  height: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

:deep(.cm-merge-pane) {
  height: 100%;
  max-height: 500px;
}

:deep(.cm-merge-gap) {
  background-color: var(--el-border-color-lighter);
  border-left: 1px solid var(--el-border-color);
  border-right: 1px solid var(--el-border-color);
}

:deep(.cm-merge-copy) {
  color: var(--el-color-primary);
}

:deep(.cm-merge-copy:hover) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.cm-merge-a) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

:deep(.cm-merge-b) {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* 暗色主题适配 */
:deep(.dark .cm-editor) {
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
}

:deep(.dark .cm-merge-gap) {
  background-color: var(--el-border-color-darker);
}

:deep(.dark .cm-merge-copy:hover) {
  background-color: var(--el-color-primary-dark-2);
}
</style> 
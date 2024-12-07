<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <button
          @click="handleJsonChange"
          class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none
                 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                 text-white"
        >
          <div class="flex items-center space-x-1.5">
            <span class="text-sm">{{ t('json.format') }}</span>
          </div>
        </button>
      </div>
      
      <div class="flex items-center gap-2">
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
    </div>

    <div class="min-h-[200px] max-h-[500px]" ref="editorContainer"></div>

    <div class="space-y-2">
      <div class="flex items-center justify-end">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('json.diffLegend') }}:</span>
          <span class="text-xs px-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400">{{ t('json.removed') }}</span>
          <span class="text-xs px-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400">{{ t('json.added') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { json } from '@codemirror/lang-json'
import { EditorView } from '@codemirror/view'
import { MergeView } from '@codemirror/merge'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'

const { t } = useI18n()

const originalJson = ref('')
const modifiedJson = ref('')
const error = ref('')
const confirmingClear = ref(false)
const editorContainer = ref<HTMLElement | null>(null)

const formatJson = (jsonStr: string): string => {
  try {
    if (!jsonStr.trim()) return ''
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch (e) {
    throw new Error(t('json.invalidJson'))
  }
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
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

const createMergeView = () => {
  if (!editorContainer.value) return

  editorContainer.value.innerHTML = ''

  new MergeView({
    a: {
      doc: originalJson.value,
      extensions: [
        basicSetup,
        json(),
        EditorState.tabSize.of(2),
        EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            originalJson.value = update.state.doc.toString()
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
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            modifiedJson.value = update.state.doc.toString()
          }
        })
      ]
    },
    parent: editorContainer.value,
    revertControls: "a-to-b",
    highlightChanges: true,
    collapseUnchanged: {
      margin: 50,
      minSize: 30
    }
  })
}

onMounted(() => {
  nextTick(() => {
    createMergeView()
  })
})
</script>

<style scoped>
:deep(.cm-editor) {
  min-height: 200px;
  max-height: 500px;
  height: auto !important;
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
  max-height: 500px !important;
  overflow: auto !important;
}

:deep(.cm-editor .cm-content) {
  margin: 0;
  padding: 4px 8px;
  text-align: left;
  min-height: 200px;
  height: auto !important;
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

:deep(.cm-merge) {
  min-height: 200px;
  max-height: 500px;
  height: auto !important;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

:deep(.cm-merge-pane) {
  min-height: 200px;
  max-height: 500px;
  height: auto !important;
}

:deep(.cm-merge-gap) {
  min-height: 200px;
  max-height: 500px;
  height: auto !important;
  background-color: var(--el-border-color-lighter);
  border-left: 1px solid var(--el-border-color);
  border-right: 1px solid var(--el-border-color);
}
</style> 
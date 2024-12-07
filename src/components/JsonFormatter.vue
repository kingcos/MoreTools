<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <button
          @click="toggleCompact"
          class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
          :class="[
            isJsonCompressed
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
          v-if="outputJson"
          @click="copyFormatted"
          class="px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                 text-gray-600 dark:text-gray-300"
        >
          {{ t('json.copy') }}
        </button>

        <div v-if="inputJson" class="inline-block">
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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <div class="flex items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('json.inputLabel') }}
          </label>
        </div>
        <div class="min-h-[200px]">
          <Codemirror
            v-model="inputJson"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @change="handleInputChange"
            class="h-full mt-3"
          />
        </div>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('json.outputLabel') }}
          </label>
        </div>
        <div class="min-h-[200px]">
          <Codemirror
            v-model="outputJson"
            :readonly="true"
            :editable="false"
            :extensions="[...extensions, EditorState.readOnly.of(true)]"
            :class="['h-full mt-3', { 'error-output': error }]"
          />
        </div>
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
import { EditorState } from '@codemirror/state'
import { Fold } from '@element-plus/icons-vue'

const { t } = useI18n()

const inputJson = ref('')
const outputJson = ref('')
const error = ref('')
const confirmingClear = ref(false)
const isJsonCompressed = ref(false)

const extensions = computed(() => [
  json(),
  lineNumbers(),
  EditorView.theme({
    '&': {
      backgroundColor: 'transparent !important',
      height: '100%',
      cursor: 'text'
    },
    '.cm-gutters': {
      backgroundColor: 'transparent !important',
      borderRight: '1px solid var(--el-border-color-lighter)'
    },
    '.cm-content': {
      cursor: 'text',
      height: '100%',
      minHeight: '200px'
    },
    '.cm-scroller': {
      cursor: 'text'
    }
  })
])

const handleInputChange = (value: string) => {
  try {
    if (!value.trim()) {
      outputJson.value = ''
      error.value = ''
      return
    }
    
    const parsed = JSON.parse(value)
    outputJson.value = JSON.stringify(parsed, null, isJsonCompressed.value ? 0 : 2)
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    outputJson.value = `Error: ${error.value}`
  }
}

const toggleCompact = () => {
  isJsonCompressed.value = !isJsonCompressed.value
  handleInputChange(inputJson.value)
}

const resetContent = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
  confirmingClear.value = false
}

const copyFormatted = async () => {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    ElMessage.success(t('json.copySuccess'))
  } catch (e) {
    ElMessage.error(t('json.copyError'))
  }
}
</script>

<style scoped>
/* 复制原组件中的相关样式 */
:deep(.cm-editor) {
  height: 100%;
  min-height: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: text;
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
  cursor: text;
}

:deep(.cm-editor .cm-content) {
  margin: 0;
  padding: 4px 8px;
  text-align: left;
  cursor: text;
}

:deep(.cm-line) {
  padding: 0;
  text-align: left;
}

:deep(.cm-gutters) {
  border-right: 1px solid var(--el-border-color-lighter);
  background-color: transparent !important;
}

:deep(.cm-lineNumbers) {
  min-width: 3em;
}

:deep(.el-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.error-output .cm-content) {
  color: var(--el-color-danger) !important;
}

:deep(.dark .error-output .cm-content) {
  color: var(--el-color-danger) !important;
}
</style> 
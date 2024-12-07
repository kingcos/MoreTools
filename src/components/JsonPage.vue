<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('json.title') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4 max-w-4xl mx-auto space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <el-tabs v-model="currentTab" class="dark-mode-tabs" type="border-card">
            <el-tab-pane
              v-for="tab in tabs" 
              :key="tab.key"
              :label="t(tab.title)"
              :name="tab.key"
            />
          </el-tabs>

          <div class="p-6 space-y-6">
            <div class="flex justify-between items-center">
              <div>
                <button
                  @click="toggleCompact"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none inline-flex items-center gap-2"
                  :class="[
                    isCompact
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  ]"
                >
                  <el-icon class="w-4 h-4"><Fold /></el-icon>
                  {{ t('json.compress') }}
                </button>
              </div>
              
              <div class="flex items-center gap-2">
                <button
                  v-if="outputJson"
                  @click="copyFormatted"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-600 dark:text-gray-300"
                >
                  {{ t('json.copy') }}
                </button>

                <div v-if="inputJson" class="inline-block">
                  <div v-if="confirmingClear" class="flex items-center space-x-2">
                    <button
                      @click="resetContent"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                    >
                      {{ t('json.confirmReset') }}
                    </button>
                    <button
                      @click="confirmingClear = false"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >
                      {{ t('json.cancel') }}
                    </button>
                  </div>
                  <button
                    v-else
                    @click="confirmingClear = true"
                    class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
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
                    class="h-full mt-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 relative">
          <Adsense
            adStyle="max-height: 150px; width: 100%;"
            slotId="2839839840"
            format="auto"
            fullWidthResponsive="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElTabs, ElTabPane, ElButton, ElButtonGroup, ElMessage, ElIcon } from 'element-plus'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { lineNumbers } from '@codemirror/view'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import Adsense from './Adsense.vue'
import { Fold } from '@element-plus/icons-vue'

const { t } = useI18n()

const currentTab = ref('jsonFormat')
const tabs = [
  { key: 'jsonFormat', title: 'json.format' }
]

const inputJson = ref('')
const outputJson = ref('')
const error = ref('')
const isCompact = ref(false)
const confirmingClear = ref(false)

// CodeMirror 扩展置
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

// 处理输入变化
const handleInputChange = (value: string) => {
  try {
    if (!value.trim()) {
      outputJson.value = ''
      error.value = ''
      return
    }
    
    const parsed = JSON.parse(value)
    outputJson.value = JSON.stringify(parsed, null, isCompact.value ? 0 : 2)
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    outputJson.value = ''
  }
}

// 切换压缩/展开
const toggleCompact = () => {
  isCompact.value = !isCompact.value
  handleInputChange(inputJson.value)
}

// 重置内容
const resetContent = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
  confirmingClear.value = false
}

// 复制格式化后的内容
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
:deep(.dark-mode-tabs.el-tabs) {
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

  .el-tabs__content {
    padding: 0;
  }
}

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

/* 可以添加按钮hover效果的样式 */
button {
  transition: all 0.2s ease;
}

:deep(.el-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import parse from 'json-parse-better-errors'
import json2xml from 'json2xml'
import { useClipboard } from '@vueuse/core'

const { t } = useI18n()
const { copy, copied } = useClipboard()

const jsonInput = ref('')
const jsonOutput = ref('')
const errorMessage = ref('')
const showLineNumbers = ref(false)
const isXmlMode = ref(false)
const confirmingAction = ref<string | null>(null)

// 实时格式化JSON
watch(jsonInput, (newValue) => {
  if (!newValue.trim()) {
    jsonOutput.value = ''
    errorMessage.value = ''
    return
  }

  try {
    const parsed = parse(newValue)
    if (isXmlMode.value) {
      jsonOutput.value = json2xml(parsed)
    } else {
      jsonOutput.value = JSON.stringify(parsed, null, 2)
    }
    errorMessage.value = ''
  } catch (e) {
    errorMessage.value = e.message
    jsonOutput.value = `${t('json.errorPrefix')}\n\n${e.message}`
  }
})

// 压缩JSON
const compressJson = () => {
  try {
    const parsed = parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsed)
  } catch (e) {
    // 保持当前错误状态
  }
}

// 转换为XML
const toggleXmlMode = () => {
  isXmlMode.value = !isXmlMode.value
  // 触发重新格式化
  const currentInput = jsonInput.value
  jsonInput.value = ''
  jsonInput.value = currentInput
}

// 复制内容
const copyOutput = async () => {
  await copy(jsonOutput.value)
}

// 重置内容
const resetContent = () => {
  jsonInput.value = ''
  jsonOutput.value = ''
  errorMessage.value = ''
  isXmlMode.value = false
  showLineNumbers.value = false
  confirmingAction.value = null
}

// 取消操作
const cancelAction = () => {
  confirmingAction.value = null
}

// 处理行号显示
const formattedOutput = computed(() => {
  if (!showLineNumbers.value) return jsonOutput.value
  
  return jsonOutput.value.split('\n').map((line, index) => {
    return `${(index + 1).toString().padStart(4, ' ')} | ${line}`
  }).join('\n')
})
</script>

<template>
  <div class="h-full flex flex-col p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('menu.devTools.json') }}</h1>
    
    <div class="flex-1 flex flex-col md:flex-row gap-4">
      <!-- 输入区域 -->
      <div class="flex-1">
        <textarea
          v-model="jsonInput"
          class="w-full h-full p-4 font-mono rounded-lg bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 
                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          :placeholder="t('json.inputPlaceholder')"
        ></textarea>
      </div>
      
      <!-- 输出区域 -->
      <div class="flex-1 flex flex-col">
        <!-- 按钮组 -->
        <div class="flex justify-between mb-2">
          <div class="flex gap-2">
            <button
              @click="compressJson"
              class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 
                     dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {{ t('json.compress') }}
            </button>
            <button
              @click="toggleXmlMode"
              :class="[
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                isXmlMode
                  ? 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
              ]"
            >
              {{ t('json.toXml') }}
            </button>
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
          
          <div class="flex gap-2">
            <button
              @click="copyOutput"
              class="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white 
                     rounded-lg transition-colors relative"
            >
              {{ t('common.copy') }}
              <span
                v-if="copied"
                class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs 
                       bg-gray-800 text-white rounded whitespace-nowrap"
              >
                {{ t('common.copied') }}
              </span>
            </button>

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
          </div>
        </div>
        
        <!-- 输出文本框 -->
        <textarea
          v-model="formattedOutput"
          readonly
          :class="[
            'flex-1 w-full p-4 font-mono rounded-lg border',
            errorMessage 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          ]"
          :placeholder="t('json.outputPlaceholder')"
        ></textarea>
      </div>
    </div>
  </div>
</template>
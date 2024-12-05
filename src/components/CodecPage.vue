<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('menu.devTools.codec') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4 max-w-4xl mx-auto space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <!-- Tab切换 -->
          <div class="flex space-x-2 mb-4">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="currentTab = tab.key"
              class="px-4 py-2 rounded-lg transition-colors focus:outline-none"
              :class="[
                currentTab === tab.key
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ t(tab.title) }}
            </button>
          </div>

          <!-- 输入区域 -->
          <div class="space-y-4">
            <!-- 输入框标签和文本框 -->
            <div class="space-y-2">
              <div class="flex items-center">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('codec.inputLabel') }}
                </label>
              </div>
              <textarea
                v-model="inputText"
                class="w-full h-40 p-2 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-gray-300 
                       dark:focus:border-gray-600"
                :placeholder="t('codec.input')"
              ></textarea>
            </div>

            <!-- 交换按钮 -->
            <button
              @click="swapContent"
              class="mx-auto block px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 
                     text-gray-700 dark:text-gray-300 rounded-lg transition-colors focus:outline-none"
            >
              🔄
            </button>

            <!-- 输出框标签和文本框 -->
            <div class="space-y-2">
              <div class="flex items-center">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('codec.outputLabel') }}
                </label>
              </div>
              <textarea
                v-model="outputText"
                class="w-full h-40 p-2 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-gray-300 
                       dark:focus:border-gray-600"
                readonly
                :placeholder="t('codec.output')"
              ></textarea>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-between items-center">
              <div class="space-x-2">
                <button
                  @click="handleEncode"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                         text-white rounded-lg transition-colors focus:outline-none"
                >{{ t('codec.encode') }}</button>
                <button
                  @click="handleDecode"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 
                         text-white rounded-lg transition-colors focus:outline-none"
                >{{ t('codec.decode') }}</button>
              </div>

              <div class="space-x-2">
                <button
                  v-if="inputText"
                  @click="copyText"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-600 dark:text-gray-300 rounded-lg transition-colors focus:outline-none"
                >{{ t('codec.copy') }}</button>

                <div v-if="inputText" class="inline-block">
                  <div v-if="confirmingClear" class="flex items-center space-x-2">
                    <button
                      @click="handleClear"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                    >{{ t('codec.confirmClear') }}</button>
                    <button
                      @click="confirmingClear = false"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >{{ t('codec.cancel') }}</button>
                  </div>
                  <button
                    v-else
                    @click="confirmingClear = true"
                    class="px-4 py-2 bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400
                           rounded-lg transition-colors focus:outline-none"
                  >{{ t('codec.clear') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 广告区域 -->
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Adsense from './Adsense.vue'

const { t } = useI18n()
const inputText = ref('')
const outputText = ref('')
const currentTab = ref('url')
const confirmingClear = ref(false)

const tabs = [
  { key: 'url', title: 'codec.url' },
  { key: 'base64', title: 'codec.base64' }
]

// 编码处理
const handleEncode = () => {
  if (!inputText.value) return
  try {
    outputText.value = currentTab.value === 'url' 
      ? encodeURIComponent(inputText.value)
      : btoa(inputText.value)
  } catch (err) {
    ElMessage.error(String(err))
  }
}

// 解码处理
const handleDecode = () => {
  if (!inputText.value) return
  try {
    outputText.value = currentTab.value === 'url'
      ? decodeURIComponent(inputText.value)
      : atob(inputText.value)
  } catch (err) {
    ElMessage.error(String(err))
  }
}

// 交换输入和输出内容
const swapContent = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

// 复制文本
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage({
      message: t('codec.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage({
      message: t('codec.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 清空输入
const handleClear = () => {
  inputText.value = ''
  outputText.value = ''
  confirmingClear.value = false
}
</script>
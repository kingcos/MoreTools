<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
    <div class="p-4 max-w-4xl mx-auto space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('menu.devTools.qrcode') }}</h1>
      
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <textarea
            v-model="inputText"
            class="w-full h-40 p-2 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-gray-300 
                   dark:focus:border-gray-600"
            :placeholder="t('qrcode.placeholder')"
          ></textarea>
          <div class="mt-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
              <button
                @click="generateQRCode"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                       text-white rounded-lg transition-colors focus:outline-none"
              >{{ t('qrcode.save') }}</button>
              
              <button
                @click="toggleInstantMode"
                class="text-sm px-3 py-1 rounded-full transition-colors focus:outline-none"
                :class="[
                  instantMode 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                ]"
              >
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ t('qrcode.incognito') }}</span>
                </div>
              </button>
            </div>

            <div class="flex items-center">
              <div v-if="confirmingAction === 'reset'" class="flex items-center space-x-2 text-xs">
                <button
                  @click="handleConfirm(-1, 'reset')"
                  class="text-red-500 hover:underline"
                >{{ t('qrcode.confirmReset') }}</button>
                <button
                  @click="cancelAction"
                  class="text-gray-500 hover:underline"
                >{{ t('common.cancel') }}</button>
              </div>
              <button
                v-else
                @click="confirmingAction = 'reset'"
                class="text-sm text-red-500 hover:text-red-600 transition-colors focus:outline-none"
              >{{ t('qrcode.reset') }}</button>
            </div>
          </div>
        </div>

        <div class="w-full md:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col items-center">
          <qrcode-vue
            :value="qrcodeText || ' '"
            :size="200"
            level="H"
            render-as="svg"
            class="mb-4"
            ref="qrcodeRef"
          ></qrcode-vue>
          <button
            @click="downloadQRCode"
            class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                   text-gray-800 dark:text-white rounded-lg transition-colors focus:outline-none"
          >{{ t('qrcode.download') }}</button>
        </div>
      </div>

      <!-- 广告区域 - 在历史记录之前 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 relative">
        <!-- 广告标识角标 -->
        <div class="absolute top-0 left-0 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 
                    text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg 
                    opacity-75 transition-opacity hover:opacity-100">
          {{ t('common.advertisement') }}
        </div>
        
        <!-- 谷歌广告占位符 -->
        <amp-ad width="100vw" height="320"
            type="adsense"
            data-ad-client="ca-pub-9925978992661955"
            data-ad-slot="2839839840"
            data-auto-format="rspv"
            data-full-width="">
          <div overflow=""></div>
        </amp-ad>
      </div>

      <!-- 历史记录区域 -->
      <div v-if="history.length > 0 && !instantMode" class="space-y-4 min-h-[200px]">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('qrcode.history') }}</h2>
          <div class="flex items-center h-8">
            <div v-if="confirmingAction === 'clear'" 
                 class="flex items-center space-x-2 text-xs fade-transition"
            >
              <button
                @click="clearHistory"
                class="text-red-500 hover:underline"
              >{{ t('qrcode.confirmClear') }}</button>
              <button
                @click="cancelAction"
                class="text-gray-500 hover:underline"
              >{{ t('common.cancel') }}</button>
            </div>
            <button
              v-else
              @click="confirmingAction = 'clear'"
              class="text-sm text-red-500 hover:text-red-600 transition-colors focus:outline-none fade-transition"
            >{{ t('qrcode.clearAll') }}</button>
          </div>
        </div>
        
        <div class="space-y-2 transition-all duration-300">
          <div
            v-for="(item, index) in displayedHistory"
            :key="index"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-start gap-4"
          >
            <div class="flex-shrink-0 relative group cursor-pointer">
              <qrcode-vue
                :value="item.text"
                :size="60"
                level="H"
                render-as="svg"
                class="transition-transform duration-200"
              ></qrcode-vue>
              <div class="hidden group-hover:block absolute left-0 top-0 z-10 bg-white dark:bg-gray-800 p-3 
                          rounded-lg shadow-lg transform -translate-x-1/4 -translate-y-1/4 scale-[2]">
                <qrcode-vue
                  :value="item.text"
                  :size="200"
                  level="H"
                  render-as="svg"
                ></qrcode-vue>
              </div>
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-gray-900 dark:text-white text-left break-all line-clamp-2">{{ item.text }}</p>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2 mt-1">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="flex-shrink-0">{{ formatDate(item.timestamp) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="copyText(item.text)"
                class="p-2 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                :title="t('qrcode.copyTitle')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
              <div v-if="confirmingAction === `edit-${index}`" class="flex items-center space-x-2 text-xs">
                <button
                  @click="handleConfirm(index, 'edit')"
                  class="text-red-500 hover:underline"
                >{{ t('qrcode.confirmEdit') }}</button>
                <button
                  @click="cancelAction"
                  class="text-gray-500 hover:underline"
                >{{ t('common.cancel') }}</button>
              </div>
              <button
                v-else
                @click="confirmingAction = `edit-${index}`"
                class="p-2 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                :title="t('qrcode.editTitle')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <div v-if="confirmingAction === `delete-${index}`" class="flex items-center space-x-2 text-xs">
                <button
                  @click="handleConfirm(index, 'delete')"
                  class="text-red-500 hover:underline"
                >{{ t('qrcode.confirmDelete') }}</button>
                <button
                  @click="cancelAction"
                  class="text-gray-500 hover:underline"
                >{{ t('common.cancel') }}</button>
              </div>
              <button
                v-else
                @click="confirmingAction = `delete-${index}`"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                :title="t('qrcode.deleteTitle')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <button
            v-if="history.length > 3"
            @click="showAll = !showAll"
            class="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                   dark:hover:text-gray-200 transition-colors focus:outline-none"
          >
            {{ showAll 
                ? t('qrcode.showLess') 
                : t('qrcode.showMore', { count: history.length - 3 }) 
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const inputText = ref('')
const qrcodeText = ref('')
const history = ref<{ text: string; timestamp: number }[]>([])
const qrcodeRef = ref()
const showAll = ref(false)
const confirmingAction = ref<string | null>(null)
const instantMode = ref(false)

// 从本地存储载历史记录
onMounted(() => {
  const savedHistory = localStorage.getItem('qrcode-history')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }
})

// 生成二维码
const generateQRCode = () => {
  if (!inputText.value) return
  qrcodeText.value = inputText.value
  if (!instantMode.value) {
    saveToHistory()
  }
}

// 重置输入
const resetInput = () => {
  inputText.value = ''
  qrcodeText.value = ''
}

// 删除历史记录
const deleteHistory = (index: number) => {
  history.value.splice(index, 1)
  localStorage.setItem('qrcode-history', JSON.stringify(history.value))
}

// 修改保存历史记录函数
const saveToHistory = () => {
  if (!inputText.value) return
  
  // 检查是否存在相同文本的记录
  const existingIndex = history.value.findIndex(item => item.text === inputText.value)
  
  if (existingIndex !== -1) {
    // 如果存在相同文本，则更新时间戳
    history.value[existingIndex].timestamp = Date.now()
    // 将更新的记录移到最前面
    const updatedItem = history.value.splice(existingIndex, 1)[0]
    history.value.unshift(updatedItem)
  } else {
    // 如果不存在，则添加新记录
    history.value.unshift({
      text: inputText.value,
      timestamp: Date.now()
    })
    
    if (history.value.length > 20) {
      history.value.pop()
    }
  }
  
  localStorage.setItem('qrcode-history', JSON.stringify(history.value))
}

// 下载二维码图片
const downloadQRCode = () => {
  if (!qrcodeRef.value) return
  
  const svg = qrcodeRef.value.$el
  const serializer = new XMLSerializer()
  const source = serializer.serializeToString(svg)
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)
  
  const link = document.createElement('a')
  link.download = 'qrcode.svg'
  link.href = url
  link.click()
}

// 添加日期格式化函数
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 编辑历史记录
const editHistory = (item: { text: string; timestamp: number }) => {
  inputText.value = item.text
  qrcodeText.value = item.text
}

// 计算显示的历史记录
const displayedHistory = computed(() => {
  return showAll.value ? history.value : history.value.slice(0, 3)
})

// 处理确认操作
const handleConfirm = (index: number, action: 'edit' | 'delete' | 'reset') => {
  if (action === 'edit') {
    editHistory(history.value[index])
  } else if (action === 'delete') {
    deleteHistory(index)
  } else if (action === 'reset') {
    resetInput()
  }
  confirmingAction.value = null
}

// 取消操作
const cancelAction = () => {
  confirmingAction.value = null
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
  localStorage.setItem('qrcode-history', '[]')
  confirmingAction.value = null
}

// 添加复制功能
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 可以添加一个制成功的提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 切换无痕模式
const toggleInstantMode = () => {
  instantMode.value = !instantMode.value
}
</script>

<style scoped>
button:focus {
  outline: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.group:hover .group-hover\:block {
  display: block;
  opacity: 1;
}

.group-hover\:block {
  transition: all 0.3s ease-in-out;
}

.break-all {
  word-break: break-all;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.fade-transition {
  transition: all 0.3s ease-in-out;
}

.space-y-4 {
  transition: min-height 0.3s ease-in-out;
}
</style> 
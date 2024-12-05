<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('menu.devTools.time') }}</h1>
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

          <!-- 时间戳转换内容 -->
          <div v-if="currentTab === 'timestamp'">
            <div class="space-y-4">
              <!-- 时间戳转日期时间 -->
              <div class="space-y-4">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('time.timestampToDate') }}</h2>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ t('time.inputTimestamp') }}
                    </label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="inputTimestamp"
                      type="number"
                      class="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                             focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                    />
                    <div class="flex items-center">
                      <div v-if="inputTimestamp && confirmingAction === 'reset'" class="flex items-center space-x-2">
                        <button
                          @click="handleConfirm('reset')"
                          class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                                 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                        >{{ t('time.confirmReset') }}</button>
                        <button
                          @click="cancelAction"
                          class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                                 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        >{{ t('common.cancel') }}</button>
                      </div>
                      <button
                        v-else-if="inputTimestamp"
                        @click="confirmingAction = 'reset'"
                        class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none"
                        :class="[
                          confirmingAction === 'reset'
                            ? 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'
                            : 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400'
                        ]"
                      >{{ t('time.reset') }}</button>
                    </div>
                  </div>
                  <div class="flex items-center mt-2">
                    <input
                      type="checkbox"
                      v-model="isMilliseconds"
                      class="rounded border-gray-300 text-blue-600 
                             focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {{ t('time.isMilliseconds') }}
                    </span>
                  </div>
                </div>

                <!-- 仅当有结果时显示 -->
                <div v-if="convertedDate" class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ t('time.outputDate') }}
                    </label>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="font-mono text-gray-900 dark:text-white text-lg">
                      {{ convertedDate }}
                    </div>
                    <button
                      @click="copyText(convertedDate)"
                      class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                             dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg 
                             transition-colors focus:outline-none"
                    >{{ t('time.copy') }}</button>
                  </div>
                </div>
              </div>

              <!-- 分割线 -->
              <div class="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>

              <!-- 日期间转时间戳 -->
              <div class="space-y-4">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('time.dateToTimestamp') }}</h2>
                  <button
                    @click="refreshCurrentTime"
                    class="w-8 h-8 flex items-center justify-center rounded-lg
                           bg-gray-100 dark:bg-gray-700 
                           hover:bg-gray-200 dark:hover:bg-gray-600 
                           text-gray-600 dark:text-gray-400 
                           hover:text-gray-800 dark:hover:text-gray-200 
                           transition-colors focus:outline-none"
                  >
                    <span class="text-xl">🔄</span>
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    <div v-for="(unit, index) in dateUnits" :key="index" class="flex items-center">
                      <input
                        v-model="unit.value"
                        type="number"
                        :min="0"
                        :max="getMaxValue(unit.name)"
                        class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                               focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      />
                      <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">{{ t(`time.${unit.name}`) }}</span>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ t('time.outputTimestamp') }}
                      </label>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between items-center">
                        <div class="font-mono text-gray-900 dark:text-white text-lg">
                          {{ convertedTimestampMs }}
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('time.milliseconds') }}</span>
                          <button
                            @click="copyText(convertedTimestampMs)"
                            class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                                   dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg 
                                   transition-colors focus:outline-none"
                          >{{ t('time.copy') }}</button>
                        </div>
                      </div>
                      
                      <div class="flex justify-between items-center">
                        <div class="font-mono text-gray-900 dark:text-white text-lg">
                          {{ convertedTimestampSec }}
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('time.seconds') }}</span>
                          <button
                            @click="copyText(convertedTimestampSec)"
                            class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                                   dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg 
                                   transition-colors focus:outline-none"
                          >{{ t('time.copy') }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import Adsense from './Adsense.vue'

const { t } = useI18n()

// Tab 配置
const currentTab = ref('timestamp')
const tabs = [
  { key: 'timestamp', title: 'time.timestampConverter' }
]

// 间戳日期时间
const inputTimestamp = ref('')
const isMilliseconds = ref(true)

// 实时转换时间戳
const convertedDate = computed(() => {
  if (!inputTimestamp.value) return ''
  
  let timestamp = Number(inputTimestamp.value)
  if (!isMilliseconds.value) {
    timestamp *= 1000
  }
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return ''
  
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

const confirmingAction = ref<string | null>(null)

const handleConfirm = (action: 'reset') => {
  if (action === 'reset') {
    handleReset()
  }
  confirmingAction.value = null
}

const cancelAction = () => {
  confirmingAction.value = null
}

const handleReset = () => {
  inputTimestamp.value = ''
}

// 刷新当前时间
const refreshCurrentTime = () => {
  const now = new Date()
  dateUnits.value = [
    { name: 'year', value: now.getFullYear().toString() },
    { name: 'month', value: (now.getMonth() + 1).toString() },
    { name: 'day', value: now.getDate().toString() },
    { name: 'hour', value: now.getHours().toString() },
    { name: 'minute', value: now.getMinutes().toString() },
    { name: 'second', value: now.getSeconds().toString() },
    { name: 'millisecond', value: now.getMilliseconds().toString() }
  ]
}

// 年月日转时间戳
const dateUnits = ref([
  { name: 'year', value: '' },
  { name: 'month', value: '' },
  { name: 'day', value: '' },
  { name: 'hour', value: '' },
  { name: 'minute', value: '' },
  { name: 'second', value: '' },
  { name: 'millisecond', value: '' }
])

const getMaxValue = (unitName: string) => {
  const maxValues: Record<string, number> = {
    month: 12,
    day: 31,
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999
  }
  return maxValues[unitName] || undefined
}

const convertedTimestampMs = computed(() => {
  const [year, month, day, hour, minute, second, millisecond] = dateUnits.value.map(unit => parseInt(unit.value) || 0)
  const date = new Date(year, month - 1, day, hour, minute, second, millisecond)
  return date.getTime()
})

const convertedTimestampSec = computed(() => {
  return Math.floor(convertedTimestampMs.value / 1000)
})

// 复制文本
const copyText = async (text: string | number) => {
  try {
    await navigator.clipboard.writeText(String(text))
    ElMessage({
      message: t('timestamp.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage({
      message: t('timestamp.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 初始化日期输入为当前时间
onMounted(() => {
  const now = new Date()
  dateUnits.value = [
    { name: 'year', value: now.getFullYear().toString() },
    { name: 'month', value: (now.getMonth() + 1).toString() },
    { name: 'day', value: now.getDate().toString() },
    { name: 'hour', value: now.getHours().toString() },
    { name: 'minute', value: now.getMinutes().toString() },
    { name: 'second', value: now.getSeconds().toString() },
    { name: 'millisecond', value: now.getMilliseconds().toString() }
  ]
})
</script>
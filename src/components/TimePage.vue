<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('time.title') }}</h1>
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
            <div v-if="currentTab === 'timestampToDate'" class="space-y-4">
              <div class="space-y-2">
                <div class="flex items-center">
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
                </div>
                <div class="flex items-center justify-between mt-2">
                  <button
                    @click="isMilliseconds = !isMilliseconds"
                    class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                    :class="[
                      isMilliseconds
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    ]"
                  >
                    <div class="flex items-center space-x-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm">{{ t('time.isMilliseconds') }}</span>
                    </div>
                  </button>

                  <div class="flex items-center">
                    <div v-if="inputTimestamp && confirmingAction === 'reset'" class="flex items-center space-x-2">
                      <button
                        @click="handleConfirm('reset')"
                        class="px-4 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                               bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                      >{{ t('time.confirmReset') }}</button>
                      <button
                        @click="cancelAction"
                        class="px-4 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                               bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      >{{ t('time.cancel') }}</button>
                    </div>
                    <button
                      v-else-if="inputTimestamp"
                      @click="confirmingAction = 'reset'"
                      class="px-4 py-1.5 text-sm rounded-lg transition-colors focus:outline-none
                             bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400"
                    >{{ t('time.reset') }}</button>
                  </div>
                </div>
              </div>

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

            <div v-if="currentTab === 'dateToTimestamp'" class="space-y-4">
              <div class="flex items-center">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('time.inputDate') }}
                </label>
              </div>
              
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
                <button
                  @click="refreshCurrentTime"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                         text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <div class="flex items-center space-x-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{{ t('time.refresh') }}</span>
                  </div>
                </button>

                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('time.outputTimestamp') }}
                  </label>
                </div>
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
import { ElMessage, ElTabs, ElTabPane } from 'element-plus'
import Adsense from './Adsense.vue'

const { t } = useI18n()

const currentTab = ref('timestampToDate')
const tabs = [
  { key: 'timestampToDate', title: 'time.timestampToDate' },
  { key: 'dateToTimestamp', title: 'time.dateToTimestamp' }
]

const inputTimestamp = ref('')
const isMilliseconds = ref(true)

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

const copyText = async (text: string | number) => {
  try {
    await navigator.clipboard.writeText(String(text))
    ElMessage({
      message: t('time.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage({
      message: t('time.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

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
</style>
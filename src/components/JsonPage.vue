<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('json.title') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4 mx-auto space-y-4" :class="{ 'max-w-4xl': isCompactMode }">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <el-tabs v-model="currentTab" class="dark-mode-tabs" type="border-card">
            <el-tab-pane
              v-for="tab in tabs" 
              :key="tab.key"
              :label="t(tab.title)"
              :name="tab.key"
            />
          </el-tabs>

          <JsonFormatter v-if="currentTab === 'jsonFormat'" />
          <JsonDiff v-if="currentTab === 'jsonDiff'" />
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElTabs, ElTabPane } from 'element-plus'
import Adsense from './Adsense.vue'
import JsonFormatter from './JsonFormatter.vue'
import JsonDiff from './JsonDiff.vue'
import { useDisplayMode } from '../composables/useDisplayMode'

const { t } = useI18n()
const { isCompactMode } = useDisplayMode()

const currentTab = ref('jsonFormat')
const tabs = [
  { key: 'jsonFormat', title: 'json.format' },
  { key: 'jsonDiff', title: 'json.diff' }
]
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

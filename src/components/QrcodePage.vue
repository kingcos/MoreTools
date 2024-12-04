<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('menu.devTools.qrcode') }}</h1>
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
        <!-- 二维码工具的具体实现将在这里 -->
        <p>二维码生成工具</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script> 
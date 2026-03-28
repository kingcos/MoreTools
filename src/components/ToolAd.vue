<template>
  <div
    v-if="isEnabled"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3"
  >
    <Adsense
      :slot-id="slotId"
      ad-style="display: block; width: 100%;"
      format="rectangle"
      full-width-responsive="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Adsense from './Adsense.vue'

const props = defineProps<{
  page: 'about' | 'codec' | 'qrcode' | 'time' | 'json' | 'light' | 'text'
}>()

const commonSlot = (import.meta.env.VITE_ADSENSE_SLOT_TOOLS as string | undefined)?.trim() || '3213735320'

const pageSlotMap = {
  about: (import.meta.env.VITE_ADSENSE_SLOT_ABOUT as string | undefined)?.trim() || '',
  codec: (import.meta.env.VITE_ADSENSE_SLOT_CODEC as string | undefined)?.trim() || '',
  qrcode: (import.meta.env.VITE_ADSENSE_SLOT_QRCODE as string | undefined)?.trim() || '',
  time: (import.meta.env.VITE_ADSENSE_SLOT_TIME as string | undefined)?.trim() || '',
  json: (import.meta.env.VITE_ADSENSE_SLOT_JSON as string | undefined)?.trim() || '',
  light: (import.meta.env.VITE_ADSENSE_SLOT_LIGHT as string | undefined)?.trim() || '',
  text: (import.meta.env.VITE_ADSENSE_SLOT_TEXT as string | undefined)?.trim() || '',
} as const

const slotId = computed(() => pageSlotMap[props.page] || commonSlot)
const isEnabled = computed(() => import.meta.env.PROD && !!slotId.value)
</script>

<template>
  <ins
    v-if="isEnabled"
    ref="adEl"
    class="adsbygoogle"
    :style="adStyle"
    :data-ad-client="clientId"
    :data-ad-slot="slotId"
    :data-ad-format="format"
    :data-ad-layout-key="layoutKey || undefined"
    :data-ad-layout="layout || undefined"
    :data-full-width-responsive="fullWidthResponsive"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

defineOptions({
  name: 'AdsenseBlock',
})

interface AdsByGoogleWindow extends Window {
  adsbygoogle?: unknown[]
}

let adsenseScriptPromise: Promise<void> | null = null

const loadAdsenseScript = (adsenseClientId: string): Promise<void> => {
  if (adsenseScriptPromise) return adsenseScriptPromise

  adsenseScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-adsense-script="true"]')
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load AdSense script')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = 'anonymous'
    script.dataset.adsenseScript = 'true'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true },
    )
    script.addEventListener('error', () => reject(new Error('Failed to load AdSense script')), { once: true })
    document.head.appendChild(script)
  })

  return adsenseScriptPromise
}

const props = withDefaults(
  defineProps<{
    slotId: string
    adStyle?: string
    format?: string
    fullWidthResponsive?: 'true' | 'false'
    layoutKey?: string
    layout?: string
  }>(),
  {
    adStyle: 'display: block',
    format: 'auto',
    fullWidthResponsive: 'true',
    layoutKey: '',
    layout: '',
  },
)

const clientId = (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined)?.trim() || 'ca-pub-9925978992661955'
const isEnabled = computed(() => import.meta.env.PROD && !!clientId && !!props.slotId)
const adEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!isEnabled.value || !adEl.value) return

  try {
    await loadAdsenseScript(clientId)
    await nextTick()
    ;(((window as AdsByGoogleWindow).adsbygoogle = (window as AdsByGoogleWindow).adsbygoogle || []) as unknown[]).push(
      {},
    )
  } catch {
    // Script can be blocked by browser extensions/privacy settings.
  }
})
</script>

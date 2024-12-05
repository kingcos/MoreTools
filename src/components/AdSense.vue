<template>
  <div>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-9925978992661955"
         :data-ad-slot="adSlot"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script lang="ts">
import { onMounted, defineProps } from 'vue';

const props = defineProps({
  adSlot: {
    type: String,
    required: true
  }
});

export default {
  name: 'AdSense',
  setup() {
    onMounted(() => {
      // 检查是否已加载脚本
      if (!document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9925978992661955';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      // 广告加载
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  },
};
</script>

<style scoped>
.adsbygoogle {
  display: block;
  width: 100%;
  max-width: 728px;
  margin: 0 auto;
}
</style> 
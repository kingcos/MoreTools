<template>
  <component 
    async
    :is="'script'"
    :src="scriptSrc"
    crossorigin="anonymous">
  </component>
  <ins 
    class="adsbygoogle"
    data-ad-client="ca-pub-9925978992661955"
    :style="adStyle"
    :data-ad-slot="slotId"
    :data-ad-format="format"
    :data-ad-layout-key="layoutKey"
    :data-ad-layout="layout"
    :data-full-width-responsive="fullWidthResponsive">
  </ins>
  <component :is="'script'">
    (adsbygoogle = window.adsbygoogle || []).push({});
  </component>
</template>

<script lang="ts">
export default {
  name: 'Adsense',
  props: {
    adStyle: {
      type: String,
      required: false,
      default: 'display: block'
    },
    slotId: {
      type: String,
      required: true  
    },
    format: {
      type: String,
      required: false,
      default: ''
    },
    fullWidthResponsive: {
      type: String,
      required: false,
      default: 'false'
    },
    layoutKey: {
      type: String,
      required: false,
      default: ''
    },
    layout: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      scriptSrc: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9925978992661955`
    }
  }
}
</script>

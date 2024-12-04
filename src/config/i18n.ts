import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import en from './locales/en'
import ja from './locales/ja'

const messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja
}

export const LOCALES = [
  { code: 'zh-CN', name: '简体中文', emoji: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', emoji: '🇨🇳' },
  { code: 'en', name: 'English', emoji: '🇺🇸' },
  { code: 'ja', name: '日本語', emoji: '🇯🇵' }
]

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'en',
  messages
}) 
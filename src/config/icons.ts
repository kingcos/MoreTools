import { Component } from 'vue'
import QrcodeIcon from '../components/icons/QrcodeIcon.vue'
import CodeIcon from '../components/icons/CodeIcon.vue'
import TimeIcon from '../components/icons/TimeIcon.vue'
import JsonIcon from '../components/icons/JsonIcon.vue'
import LightIcon from '../components/icons/LightIcon.vue'
import AboutIcon from '../components/icons/AboutIcon.vue'
import TextIcon from '../components/icons/TextIcon.vue'

// 定义图标名称的类型
export type IconName = 'Qrcode' | 'Code' | 'Time' | 'Json' | 'Light' | 'About' | 'Text'

// 添加类型注解
export const icons: Record<IconName, Component> = {
  Qrcode: QrcodeIcon,
  Code: CodeIcon,
  Time: TimeIcon,
  Json: JsonIcon,
  Light: LightIcon,
  About: AboutIcon,
  Text: TextIcon
} as const

export type IconName = keyof typeof icons
  
import QrcodeIcon from '../components/icons/QrcodeIcon.vue'
import CodeIcon from '../components/icons/CodeIcon.vue'
import TimeIcon from '../components/icons/TimeIcon.vue'
import JsonIcon from '../components/icons/JsonIcon.vue'
import LightIcon from '../components/icons/LightIcon.vue'
import AboutIcon from '../components/icons/AboutIcon.vue'
import TextIcon from '../components/icons/TextIcon.vue'

// 添加类型注解
export const icons = {
  Qrcode: QrcodeIcon,
  Code: CodeIcon,
  Time: TimeIcon,
  Json: JsonIcon,
  Light: LightIcon,
  About: AboutIcon,
  Text: TextIcon
} as const

// 从 icons 对象中推导出 IconName 类型
export type IconName = keyof typeof icons
  
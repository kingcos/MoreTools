import { IconName } from './icons'

interface MenuItem {
  id: string
  titleKey: string
  component?: string
  icon?: IconName
}

interface MenuGroup {
  id: string
  titleKey: string
  isOpen: boolean
  children: MenuItem[]
}

declare const menu: {
  menuItems: MenuGroup[]
}

export default menu 
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_CLIENT_ID?: string
  readonly VITE_ADSENSE_SLOT_TOOLS?: string
  readonly VITE_ADSENSE_SLOT_ABOUT?: string
  readonly VITE_ADSENSE_SLOT_CODEC?: string
  readonly VITE_ADSENSE_SLOT_QRCODE?: string
  readonly VITE_ADSENSE_SLOT_TIME?: string
  readonly VITE_ADSENSE_SLOT_JSON?: string
  readonly VITE_ADSENSE_SLOT_LIGHT?: string
  readonly VITE_ADSENSE_SLOT_TEXT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

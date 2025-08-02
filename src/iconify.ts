import { addCollection, setCustomIconsLoader } from '@iconify/vue'
import lucide from '@iconify-json/lucide/icons.json'

// Optionally: avoid any remote fetch by using a custom loader
setCustomIconsLoader(
  async (_icons: string[]) => (lucide),
  'lucide'
)

addCollection(lucide)

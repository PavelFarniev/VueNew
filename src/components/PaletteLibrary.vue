<template>
  <div>
    <h2>Библиотека палитр</h2>
    <input v-model="q" placeholder="Поиск по имени..." />
    <div v-if="filtered.length===0">Палитр ещё нет</div>
    <div class="list">
      <div v-for="p in filtered" :key="p.id" class="palette-card">
        <div class="meta">
          <h4>{{ p.name }}</h4>
          <div class="actions">
            <button @click="toggleFavorite(p.id)">{{ favorites.includes(p.id) ? '★' : '☆' }}</button>
            <button @click="remove(p.id)">Удалить</button>

            <!-- Выпадающее меню экспорта -->
            <div class="export-dropdown">
              <button class="export-btn">Экспорт ▼</button>
              <div class="export-menu">
                <button @click="exportPalette(p, 'css')">CSS Variables</button>
                <button @click="exportPalette(p, 'scss')">SCSS Variables</button>
                <button @click="exportPalette(p, 'tailwind')">Tailwind Config</button>
              </div>
            </div>
          </div>
        </div>
        <div class="colors">
          <div v-for="c in p.colors" :key="c" class="sw" :style="{ background: c }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { usePaletteStore } from '../store/paletteStore'
import { exportCSSVariables, exportSCSS, exportTailwind } from '../utils/exportUtils'

export default {
  name: 'PaletteLibrary',
  setup() {
    const q = ref('')
    const { palettes, favorites, removePalette, toggleFavorite } = usePaletteStore()

    const filtered = computed(() => {
      if (!q.value) return palettes.value
      return palettes.value.filter(p =>
          p.name.toLowerCase().includes(q.value.toLowerCase())
      )
    })

    const remove = (id) => {
      if (confirm('Удалить палитру?')) removePalette(id)
    }

    // Функция экспорта в разных форматах
    const exportPalette = (palette, format) => {
      const fileName = palette.name
          .replace(/\s+/g, '-')
          .toLowerCase()
          .replace(/[^a-z0-9\-]/g, '')

      let content = ''
      let extension = ''

      switch(format) {
        case 'css':
          content = exportCSSVariables(fileName, palette.colors)
          extension = 'css'
          break
        case 'scss':
          content = exportSCSS(fileName, palette.colors)
          extension = 'scss'
          break
        case 'tailwind':
          content = exportTailwind(fileName, palette.colors)
          extension = 'js'
          break
        default:
          content = exportCSSVariables(fileName, palette.colors)
          extension = 'css'
      }

      downloadFile(content, `${fileName}.${extension}`)
    }

    // Функция скачивания файла
    const downloadFile = (content, fileName) => {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    }

    return {
      q,
      filtered,
      favorites,
      remove,
      toggleFavorite,
      exportPalette
    }
  }
}
</script>

<style scoped>
.palette-card {
  border: 1px solid #eee;
  padding: 12px;
  margin: 12px 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.colors {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.sw {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex-shrink: 0;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.meta h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.actions button {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:hover {
  background: #e0e0e0;
}

/* Стили для выпадающего меню экспорта */
.export-dropdown {
  position: relative;
  display: inline-block;
}

.export-btn {
  background: #4f46e5 !important;
  color: white !important;
  border: none !important;
}

.export-btn:hover {
  background: #4338ca !important;
}

.export-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: none;
  flex-direction: column;
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.export-dropdown:hover .export-menu {
  display: flex;
}

.export-menu button {
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 0;
  margin: 0;
  font-size: 13px;
}

.export-menu button:hover {
  background: #f5f5f5;
}

/* Адаптивность */
@media (max-width: 768px) {
  .meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    justify-content: flex-start;
  }

  .export-dropdown {
    width: 100%;
  }

  .export-btn {
    width: 100%;
  }

  .export-menu {
    right: auto;
    left: 0;
    min-width: 100%;
  }
}
</style>
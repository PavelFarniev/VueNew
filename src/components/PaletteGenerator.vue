<template>
  <div class="demo-block palette-generator">
    <h2>Генератор палитр</h2>

    <!-- ========== ПАНЕЛЬ УПРАВЛЕНИЯ ========== -->
    <div class="controls">

      <div class="control">
        <label>Базовый цвет</label>
        <input type="color" v-model="baseHex" @input="onBaseHexInput" />
      </div>

      <div class="control">
        <label>Тип палитры</label>
        <select v-model="schemeType" @change="generate">
          <option value="analogous">Analogous</option>
          <option value="triad">Triad</option>
          <option value="complementary">Complementary</option>
          <option value="monochrome">Monochrome</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div class="control">
        <label>Кол-во</label>
        <select v-model.number="count" @change="generate">
          <option :value="3">3</option>
          <option :value="5">5</option>
          <option :value="7">7</option>
        </select>
      </div>

      <div class="control">
        <label>Формат</label>
        <select v-model="format" @change="onFormatChange">
          <option value="HEX">HEX</option>
          <option value="RGB">RGB</option>
        </select>
      </div>

      <div class="control">
        <label></label>
        <button @click="randomize">Random</button>
      </div>

      <div class="control">
        <label></label>
        <label class="switch">
          <input type="checkbox" v-model="darkPreview" />
          <span>Dark preview</span>
        </label>
      </div>

    </div>

    <!-- ========== ПАЛИТРА ========== -->
    <div class="palette-row">
      <div v-for="(c,i) in colors" :key="i" class="color-wrapper">

        <div class="swatch" :style="{ backgroundColor: c }" @click="copyColor(c, i)">
          <button class="pin-btn" @click.stop="togglePin(i)">
            {{ pinned[i] ? '📌' : '📍' }}
          </button>

          <div v-if="copiedIndex === i" class="copied">Copied</div>
        </div>

        <div class="meta">
          <div class="col-value">{{ displayColor(c) }}</div>
          <button @click="removeColor(i)" title="Remove">✕</button>
        </div>

      </div>
    </div>

    <!-- ========== ПРЕДПРОСМОТР ========== -->
    <div class="preview" :class="{ dark: darkPreview }">
      <h3>Preview</h3>

      <div class="mockup">

        <button class="btn" :style="{ backgroundColor: colors[0] || '#ccc' }">
          Кнопка
        </button>

        <div class="card"
             :style="{ borderColor: colors[1] || '#ddd' }">

          <h4 :style="{ color: colors[2] || '#333' }">Заголовок</h4>

          <p :style="{ color: colors[3] || '#666' }">
            Пример текста, использующего палитру.
          </p>

        </div>

      </div>
    </div>

    <!-- ========== ДЕЙСТВИЯ ========== -->
    <div class="actions">
      <input v-model="paletteName" placeholder="Имя палитры" />
      <button @click="savePalette">Сохранить</button>
      <button @click="exportCSS">Export CSS</button>
      <button @click="exportSCSS">Export SCSS</button>
      <button @click="exportTailwind">Export Tailwind</button>
    </div>

  </div>
</template>


<script>
import { ref, watch } from 'vue'
import {
  generateScheme,
  randomHex,
  normalizeToHex,
  parseColorToRGB,
  rgbToHex
} from '../utils/colorTools'

import { usePaletteStore } from '../store/paletteStore'

import {
  exportCSSVariables,
  exportSCSS as exportSCSSUtil,
  exportTailwind as exportTailwindUtil
} from '../utils/exportUtils'

export default {
  name: 'PaletteGenerator',

  setup() {
    const baseHex = ref('#3B82F6')
    const schemeType = ref('analogous')
    const count = ref(5)
    const format = ref('HEX')
    const colors = ref([])
    const pinned = ref([])
    const paletteName = ref('')
    const darkPreview = ref(false)
    const copiedIndex = ref(-1)

    const store = usePaletteStore()

    function generate() {
      const generated = generateScheme(baseHex.value, schemeType.value, count.value)

      for (let i = 0; i < generated.length; i++) {
        if (pinned.value[i]) {
          generated[i] = colors.value[i] || generated[i]
        }
      }

      colors.value = generated

      while (pinned.value.length < colors.value.length) {
        pinned.value.push(false)
      }
    }

    function randomize() {
      baseHex.value = randomHex()
      generate()
    }

    function onBaseHexInput() {
      baseHex.value = normalizeToHex(baseHex.value)
      generate()
    }

    function onFormatChange() {}

    function displayColor(hex) {
      if (format.value === 'HEX') return hex
      const { r, g, b } = parseColorToRGB(hex)
      return `rgb(${r}, ${g}, ${b})`
    }

    function togglePin(i) {
      pinned.value[i] = !pinned.value[i]
    }

    async function copyColor(c, i) {
      try {
        await navigator.clipboard.writeText(displayColor(c))
        copiedIndex.value = i

        setTimeout(() => {
          if (copiedIndex.value === i) copiedIndex.value = -1
        }, 1200)
      } catch (e) {
        console.error(e)
      }
    }

    function removeColor(i) {
      colors.value.splice(i, 1)
      pinned.value.splice(i, 1)
    }

    function savePalette() {
      const palette = {
        name: paletteName.value || `Palette ${Date.now()}`,
        colors: [...colors.value]
      }

      store.addPalette(palette)
      paletteName.value = ''
      alert('Сохранено!')
    }

    function downloadText(name, text) {
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      URL.revokeObjectURL(url)
    }

    function exportCSS() {
      const txt = exportCSSVariables('palette', colors.value)
      downloadText('palette.css', txt)
    }

    function exportSCSS() {
      const txt = exportSCSSUtil('palette', colors.value)
      downloadText('palette.scss', txt)
    }

    function exportTailwind() {
      const txt = exportTailwindUtil('palette', colors.value)
      downloadText('tailwind-config.js', txt)
    }

    generate()

    watch([count, schemeType], generate)

    return {
      baseHex, schemeType, count, format, colors,
      pinned, paletteName, darkPreview, copiedIndex,

      generate, randomize, onBaseHexInput, onFormatChange,
      displayColor, togglePin, copyColor, removeColor, savePalette,
      exportCSS, exportSCSS, exportTailwind
    }
  }
}
</script>


<style scoped>
.palette-generator { max-width: 1100px; margin: 0 auto; }
.controls { display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; margin-bottom:16px; }
.control { display:flex; flex-direction:column; gap:6px; }
.palette-row { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
.color-wrapper { width:150px; }

.swatch {
  height:96px;
  border-radius:10px;
  position:relative;
  display:flex;
  justify-content:flex-end;
  padding:8px;
  cursor:pointer;
}

.pin-btn {
  background: rgba(255,255,255,0.3);
  border:none;
  border-radius:8px;
  padding:4px 6px;
  cursor:pointer;
}

.copied {
  position:absolute;
  left:8px;
  top:8px;
  background:rgba(0,0,0,0.45);
  color:white;
  padding:4px 8px;
  border-radius:8px;
  font-size:12px;
}

.meta {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:8px;
  font-family:monospace;
}

/* ===== ПРЕДПРОСМОТР ===== */

.preview {
  margin-top:16px;
  padding:12px;
  border-radius:10px;
  background:#fff;
  border:1px solid #eee;
}

/* 🔥 Исправление: заголовок меняет цвет */
.preview h3 { color:#111; }
.preview.dark h3 { color:#fff; }

.preview.dark {
  background:#111;
  color:#eee;
  border-color:#222;
}

.mockup {
  display:flex;
  gap:12px;
  align-items:flex-start;
}

.btn {
  padding:8px 12px;
  border-radius:8px;
  border:none;
  color:#fff;
}

.card {
  padding:12px;
  border-radius:8px;
  background:transparent;
  border:2px solid #ddd;
}

.actions {
  margin-top:12px;
  display:flex;
  gap:8px;
  align-items:center;
  flex-wrap:wrap;
}

input[type="text"] {
  padding:8px 10px;
  border-radius:8px;
  border:1px solid #ddd;
}
</style>

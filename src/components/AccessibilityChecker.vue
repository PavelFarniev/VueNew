<template>
  <div class="accessibility">
    <h3>Проверка доступности</h3>
    <div v-if="!colors || colors.length < 2">Добавьте минимум 2 цвета для проверки.</div>
    <div v-else class="pairs">
      <div v-for="(pair, idx) in pairs" :key="idx" class="pair">
        <div class="swatches">
          <div class="sw" :style="{ background: pair.a }"></div>
          <div class="sw" :style="{ background: pair.b }"></div>
        </div>
        <div class="info">
          <div>{{ pair.a }} ↔ {{ pair.b }}</div>
          <div>Contrast: {{ pair.contrast }} — {{ pair.level }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { contrastRatio, wcagLevel } from '../utils/wcag'
export default {
  name: 'AccessibilityChecker',
  props: { colors: { type: Array, required: true } },
  setup(props) {
    const pairs = computed(() => {
      const res = []
      for (let i=0;i<props.colors.length;i++){
        for (let j=i+1;j<props.colors.length;j++){
          const a = props.colors[i], b = props.colors[j]
          const c = contrastRatio(a,b)
          res.push({ a,b, contrast: c, level: wcagLevel(c) })
        }
      }
      return res
    })
    return { pairs }
  }
}
</script>

<style scoped>
.accessibility { margin-top:12px; padding:8px; border-radius:8px; background:#f7f7f7; }
.pair { display:flex; gap:10px; align-items:center; margin-bottom:8px; }
.swatches { display:flex; gap:4px; }
.sw { width:36px; height:36px; border-radius:4px; border:1px solid #ddd; }
.info { font-family:monospace; }
</style>

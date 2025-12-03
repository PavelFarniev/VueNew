<template>
  <div class="color-card">
    <div class="swatch" :style="{ backgroundColor: color }" @click="copyHex">
      <div v-if="copied" class="copied">Скопировано ✓</div>
      <button class="pin" @click.stop="togglePin">{{ pinned ? '📌' : '📍' }}</button>
    </div>
    <div class="meta">
      <span class="hex">{{ format }}</span>
      <button @click="$emit('remove')" class="remove" title="Удалить цвет">✕</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ColorCard',
  props: {
    color: { type: String, required: true },
    format: { type: String, default: 'HEX' },
    pinned: { type: Boolean, default: false }
  },
  emits: ['toggle-pin','remove'],
  setup(props, { emit }) {
    const copied = ref(false)
    const copyHex = async () => {
      try {
        await navigator.clipboard.writeText(props.color)
        copied.value = true
        setTimeout(()=> copied.value = false, 1200)
      } catch(e) {
        console.error('Clipboard error', e)
      }
    }
    const togglePin = () => emit('toggle-pin')
    return { copied, copyHex, togglePin }
  }
}
</script>

<style scoped>
.color-card { width: 120px; margin: 8px; }
.swatch { height: 80px; border-radius: 6px; position: relative; cursor: pointer; display:flex; justify-content:flex-end; align-items:flex-start; padding:6px; color:white; font-weight:bold; }
.copied { position:absolute; left:6px; top:6px; background: rgba(0,0,0,0.35); padding:2px 6px; border-radius:4px; font-size:12px; }
.pin { background: rgba(255,255,255,0.25); border:none; color:white; border-radius:4px; cursor:pointer; }
.meta { display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-family:monospace; }
.remove { border:none; background:none; cursor:pointer; color:#999; }
</style>

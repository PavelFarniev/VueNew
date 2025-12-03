<template>
  <div>
    <h3>Редактор палитры</h3>
    <div v-for="(c,i) in colors" :key="i" class="row">
      <input v-model="colors[i]" type="text" />
      <input type="color" v-model="colors[i]" />
      <button @click="moveUp(i)" :disabled="i===0">↑</button>
      <button @click="moveDown(i)" :disabled="i===colors.length-1">↓</button>
      <button @click="remove(i)">Удалить</button>
    </div>
    <button @click="addColor">Добавить цвет</button>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'
export default {
  name: 'PaletteEditor',
  props: { modelValue: { type: Array, default: () => [] } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const colors = ref([...props.modelValue])
    const update = () => emit('update:modelValue', colors.value.slice())
    const addColor = () => { colors.value.push('#cccccc'); update() }
    const remove = (i) => { colors.value.splice(i,1); update() }
    const moveUp = (i) => { if (i>0) { const t=colors.value[i-1]; colors.value[i-1]=colors.value[i]; colors.value[i]=t; update() } }
    const moveDown = (i) => { if (i < colors.value.length-1){ const t=colors.value[i+1]; colors.value[i+1]=colors.value[i]; colors.value[i]=t; update() } }
    return { colors, addColor, remove, moveUp, moveDown }
  }
}
</script>

import { reactive, toRefs } from 'vue'

const STORAGE_KEY = 'color_palettes_v1'

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : { palettes: [], favorites: [] }
    } catch (e) {
        console.error(e)
        return { palettes: [], favorites: [] }
    }
}

const state = reactive({
    palettes: loadFromStorage().palettes,
    favorites: loadFromStorage().favorites
})

function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        palettes: state.palettes,
        favorites: state.favorites
    }))
}

export function usePaletteStore() {
    const addPalette = (palette) => {
        state.palettes.push({ ...palette, id: Date.now() })
        persist()
    }

    const updatePalette = (id, patch) => {
        const idx = state.palettes.findIndex(p => p.id === id)
        if (idx !== -1) {
            state.palettes[idx] = { ...state.palettes[idx], ...patch }
            persist()
        }
    }

    const removePalette = (id) => {
        state.palettes = state.palettes.filter(p => p.id !== id)
        persist()
    }

    const toggleFavorite = (id) => {
        const f = state.favorites.includes(id)
        state.favorites = f ? state.favorites.filter(x => x !== id) : [...state.favorites, id]
        persist()
    }

    const clearAll = () => {
        state.palettes = []
        state.favorites = []
        persist()
    }

    return {
        ...toRefs(state),
        addPalette,
        updatePalette,
        removePalette,
        toggleFavorite,
        clearAll
    }
}

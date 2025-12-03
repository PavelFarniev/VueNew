// src/utils/colorTools.js
// Универсальные утилиты для работы с цветами

// ---- PARSERS / CONVERTERS ----
export function parseColorToRGB(color) {
    if (!color) throw new Error('Empty color')
    color = color.trim()

    // hex e.g. #abc or #aabbcc
    if (color.startsWith('#')) return hexToRgb(color)

    // rgb(...) or rgba(...)
    if (/^rgb/i.test(color)) {
        const nums = color.replace(/[^\d,]/g, '').split(',').map(n => Number(n.trim()))
        return { r: nums[0] || 0, g: nums[1] || 0, b: nums[2] || 0 }
    }

    // fallback unsupported
    throw new Error('Unsupported color format: ' + color)
}

export function hexToRgb(hex) {
    hex = hex.replace('#', '')
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    const n = parseInt(hex, 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHex(r, g, b) {
    const toHex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
    return ('#' + toHex(r) + toHex(g) + toHex(b)).toUpperCase()
}

export function normalizeToHex(color) {
    const { r, g, b } = parseColorToRGB(color)
    return rgbToHex(r, g, b)
}

// ---- RGB <-> HSL helpers ----
export function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r,g,b), min = Math.min(r,g,b)
    let h=0, s=0, l=(max+min)/2
    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h = h * 60
    }
    return { h, s: s*100, l: l*100 }
}

export function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360
    s /= 100; l /= 100
    if (s === 0) {
        const v = Math.round(l*255)
        return { r: v, g: v, b: v }
    }
    const hue2rgb = (p,q,t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q-p)*6*t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q-p)*(2/3-t)*6
        return p
    }
    const q = l < 0.5 ? l*(1+s) : l + s - l*s
    const p = 2*l - q
    const hk = h/360
    const r = hue2rgb(p,q,hk + 1/3)
    const g = hue2rgb(p,q,hk)
    const b = hue2rgb(p,q,hk - 1/3)
    return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) }
}

// ---- HUE SHIFT ----
export function shiftHue(hex, degrees) {
    const { r,g,b } = hexToRgb(hex)
    const { h, s, l } = rgbToHsl(r,g,b)
    const nh = (h + degrees + 360) % 360
    const rgb = hslToRgb(nh, s, l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
}

// ---- RANDOM HEX ----
export function randomHex() {
    const r = Math.floor(Math.random()*256)
    const g = Math.floor(Math.random()*256)
    const b = Math.floor(Math.random()*256)
    return rgbToHex(r,g,b)
}

// ---- GENERATE SCHEME (analogous, triad, complementary, monochrome, random) ----
export function generateScheme(baseHex, type = 'analogous', count = 5) {
    baseHex = normalizeToHex(baseHex)
    const res = []
    if (type === 'analogous') {
        const step = 30
        const center = Math.floor(count / 2)
        for (let i=0;i<count;i++){
            res.push( shiftHue(baseHex, (i - center) * step) )
        }
    } else if (type === 'triad') {
        // triad base offsets
        const offsets = []
        for (let i=0;i<count;i++) {
            offsets.push( (i % 3) * 120 + Math.floor(i/3)*10 )
        }
        for (let off of offsets) res.push( shiftHue(baseHex, off) )
    } else if (type === 'complementary') {
        res.push(baseHex)
        res.push( shiftHue(baseHex, 180) )
        while (res.length < count) res.push( randomHex() )
    } else if (type === 'monochrome') {
        const { h, s, l } = rgbToHsl(...Object.values(hexToRgb(baseHex)))
        const step = Math.max(6, Math.floor(40 / count))
        for (let i=0;i<count;i++){
            const nl = Math.max(6, Math.min(94, l + (i - Math.floor(count/2)) * step))
            const rgb = hslToRgb(h, s, nl)
            res.push( rgbToHex(rgb.r, rgb.g, rgb.b) )
        }
    } else {
        for (let i=0;i<count;i++) res.push( randomHex() )
    }
    return res
}

// ---- BASIC PALETTE (tints/shades) ----
export function generatePalette(baseColor, steps = 5) {
    // Keep for compatibility: return array of HEX
    return generateScheme(baseColor, 'monochrome', steps)
}

// ---- BRIGHTNESS / IS DARK ----
export function getBrightness({ r,g,b }) {
    return (r*299 + g*587 + b*114) / 1000
}
export function isDark(color) {
    const rgb = parseColorToRGB(color)
    return getBrightness(rgb) < 130
}

// ---- CONTRAST RATIO (simple) ----
export function relativeLuminance({ r,g,b }) {
    const srgb = [r,g,b].map(v => v/255).map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4))
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2]
}
export function contrastRatio(a,b) {
    const L1 = relativeLuminance(parseColorToRGB(a))
    const L2 = relativeLuminance(parseColorToRGB(b))
    const lighter = Math.max(L1,L2)
    const darker = Math.min(L1,L2)
    return +( (lighter + 0.05) / (darker + 0.05) ).toFixed(2)
}

export default {
    parseColorToRGB, hexToRgb, rgbToHex, normalizeToHex,
    rgbToHsl, hslToRgb, shiftHue, randomHex,
    generateScheme, generatePalette, isDark, contrastRatio
}

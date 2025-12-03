// WCAG contrast calculation utilities

import { parseColorToRGB } from './colorTools'

/**
 * Relative luminance calculation
 */
function luminance({ r, g, b }) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Contrast ratio between 2 colors
 */
export function contrastRatio(colorA, colorB) {
    const rgbA = parseColorToRGB(colorA);
    const rgbB = parseColorToRGB(colorB);

    const L1 = luminance(rgbA);
    const L2 = luminance(rgbB);

    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

/**
 * WCAG level checker
 */
export function wcagLevel(colorA, colorB) {
    const ratio = contrastRatio(colorA, colorB);

    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    if (ratio >= 3) return "AA (Large Text)";
    return "Fail";
}

/**
 * Compatibility helpers (optional)
 */
export function passesAA(colorA, colorB) {
    return contrastRatio(colorA, colorB) >= 4.5;
}

export function passesAAA(colorA, colorB) {
    return contrastRatio(colorA, colorB) >= 7;
}

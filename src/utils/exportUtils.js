// src/utils/exportUtils.js

export function exportCSSVariables(name, colors) {
    const lines = [`/* ${name} - CSS variables */`, `:root {`];
    colors.forEach((c, i) => {
        lines.push(`  --${name}-color-${i + 1}: ${c};`);
    });
    lines.push('}');
    return lines.join('\n');
}

export function exportSCSS(name, colors) {
    const lines = colors.map((c, i) => `$${name}-color-${i + 1}: ${c};`);
    return lines.join('\n');
}

export function exportTailwind(name, colors) {
    const obj = colors.map((c, i) => `"${i + 1}": "${c}"`).join(',\n      ');
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        '${name}': {
          ${obj}
        }
      }
    }
  },
  plugins: []
}`;
}

// Для совместимости (можно удалить если не нужно)
export function exportTailwindOld(name, colors) {
    const obj = colors.map((c, i) => `"${name}-${i + 1}": "${c}"`).join(',\n    ');
    return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${obj}
      }
    }
  }
}`;
}
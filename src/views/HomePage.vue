<template>
  <div class="home-page">
    <h1>Добро пожаловать в Color Palette App</h1>

    <div class="features">
      <div class="feature-card">
        <h3>🎨 Генератор палитр</h3>
        <p>Создавайте гармоничные цветовые схемы на основе различных алгоритмов: analogous, triad, complementary и других.</p>
        <router-link to="/palette" class="feature-link">Перейти к генератору →</router-link>
      </div>

      <div class="feature-card">
        <h3>📚 Библиотека</h3>
        <p>Сохраняйте понравившиеся палитры и экспортируйте их в CSS, SCSS или Tailwind конфигурации.</p>
        <router-link to="/library" class="feature-link">Перейти к библиотеке →</router-link>
      </div>

      <div class="feature-card">
        <h3>✅ Проверка доступности</h3>
        <p>Автоматическая проверка контрастности цветов по стандартам WCAG для создания доступных интерфейсов.</p>
        <p class="feature-note">Доступно в разделе "Палитры"</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  padding: 20px;
}

.home-page h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin-top: 0;
  color: #4f46e5;
  font-size: 1.3rem;
}

.feature-card p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-link {
  display: inline-block;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}

.feature-link:hover {
  border-bottom-color: #4f46e5;
}

.feature-note {
  font-style: italic;
  color: #888;
  font-size: 0.9rem;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
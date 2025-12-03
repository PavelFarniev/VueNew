<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 Color Palette App</h1>
      <p>Генератор и библиотека цветовых палитр</p>
    </header>

    <nav class="main-nav">
      <router-link to="/">Главная</router-link>
      <router-link to="/palette">Палитры</router-link>
      <router-link to="/library">Библиотека</router-link>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>Vue 3 + Vite • Color Palette App</p>
    </footer>
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style>
body {
  margin: 0;
  font-family: Inter, Segoe UI, Arial, sans-serif;
  background: #f5f5f5;
  color: #222;
}

* {
  box-sizing: border-box;
}

.app-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 25px;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 2.2rem;
}

.app-header p {
  margin: 8px 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.main-nav {
  display: flex;
  gap: 14px;
  padding: 14px;
  background: #fff;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}

.main-nav a {
  color: #333;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.main-nav a:hover {
  background: #f0f0f0;
}

.main-nav a.router-link-active {
  background: #667eea;
  color: #fff;
}

.main-content {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
  min-height: 60vh;
}

.app-footer {
  text-align: center;
  padding: 20px;
  background: #222;
  color: #fff;
  margin-top: 40px;
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
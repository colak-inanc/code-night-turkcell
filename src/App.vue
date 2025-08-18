<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.body.classList.add('dark')
  }
})
</script>

<template>
  <div id="app" :class="{ dark: isDark }">
    <header class="header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo-placeholder">TURKCELL</div>
          <span class="logo-text">Kurumsal</span>
        </div>

        <nav class="main-nav">
          <RouterLink to="/wizard" class="nav-link">Paket Danışmanı</RouterLink>
        </nav>

        <div class="header-actions">
          <ThemeToggle @toggle="toggleTheme" />
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h4>Hakkımızda</h4>
          <ul>
            <li><a href="#">Genel Bakış</a></li>
            <li><a href="#">Kurumsal İletişim</a></li>
            <li><a href="#">Haberler & Duyurular</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Dijital İş Servisleri</h4>
          <ul>
            <li><a href="#">Kesintisiz Erişim</a></li>
            <li><a href="#">Bulut Çözümleri</a></li>
            <li><a href="#">Siber Güvenlik</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>İşlem Merkezi</h4>
          <ul>
            <li><a href="#">Giriş Yap</a></li>
            <li><a href="#">Fatura Sorgula</a></li>
            <li><a href="#">Sipariş Takibi</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Turkcell. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-placeholder {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 1px;
  box-shadow: var(--shadow-md);
}

.logo-text {
  color: var(--color-text-light);
  font-size: 0.9rem;
  font-weight: 500;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  background: var(--color-primary-lighter);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.main-content {
  min-height: calc(100vh - 160px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.footer {
  background: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h4 {
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: var(--color-text-light);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 2rem;
  text-align: center;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>

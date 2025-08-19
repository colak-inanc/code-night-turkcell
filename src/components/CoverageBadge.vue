<template>
  <div class="coverage-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="bi bi-wifi"></i>
      </div>
      <h5 class="loading-text">Kapsama bilgileri kontrol ediliyor...</h5>
      <p class="loading-subtext">Adresiniz için mevcut teknolojiler taranıyor</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h5 class="error-title">Kapsama Bilgisi Alınamadı</h5>
      <p class="error-message">{{ error }}</p>
      <button @click="loadCoverageData" class="btn btn-outline-primary btn-sm">
        <i class="bi bi-arrow-clockwise me-2"></i>
        Tekrar Dene
      </button>
    </div>

    <!-- Coverage Results -->
    <div v-else-if="coverageData" class="coverage-results">
      <!-- Header Section -->
      <div class="coverage-header">
        <div class="header-icon">
          <i class="bi bi-geo-alt"></i>
        </div>
        <div class="header-content">
          <h4 class="header-title">Adres Kapsama Durumu</h4>
          <p class="header-subtitle">Seçilen adres için mevcut internet teknolojileri</p>
          <div class="address-info">
            <span class="address-badge">
              <i class="bi bi-hash me-1"></i>
              {{ addressId }}
            </span>
          </div>
        </div>
      </div>

      <!-- Technology Cards -->
      <div class="technology-grid">
        <!-- Fiber Card -->
        <div class="tech-card" :class="getCardClass('fiber')">
          <div class="tech-icon">
            <i class="bi bi-lightning-charge"></i>
          </div>
          <div class="tech-content">
            <h5 class="tech-title">Fiber Internet</h5>
            <div class="tech-status" :class="getStatusClass('fiber')">
              <i :class="getStatusIcon('fiber')"></i>
              {{ getStatusText('fiber') }}
            </div>
            <div class="tech-details">
              <span class="tech-speed">1000 Mbps</span>
              <span class="tech-latency">~5ms</span>
            </div>
          </div>
          <div class="tech-badge" :class="getBadgeClass('fiber')">
            {{ getBadgeText('fiber') }}
          </div>
        </div>

        <!-- VDSL Card -->
        <div class="tech-card" :class="getCardClass('vdsl')">
          <div class="tech-icon">
            <i class="bi bi-router"></i>
          </div>
          <div class="tech-content">
            <h5 class="tech-title">VDSL</h5>
            <div class="tech-status" :class="getStatusClass('vdsl')">
              <i :class="getStatusIcon('vdsl')"></i>
              {{ getStatusText('vdsl') }}
            </div>
            <div class="tech-details">
              <span class="tech-speed">100 Mbps</span>
              <span class="tech-latency">~15ms</span>
            </div>
          </div>
          <div class="tech-badge" :class="getBadgeClass('vdsl')">
            {{ getBadgeText('vdsl') }}
          </div>
        </div>

        <!-- FWA Card -->
        <div class="tech-card" :class="getCardClass('fwa')">
          <div class="tech-icon">
            <i class="bi bi-wifi"></i>
          </div>
          <div class="tech-content">
            <h5 class="tech-title">FWA (4.5G Sabit)</h5>
            <div class="tech-status" :class="getStatusClass('fwa')">
              <i :class="getStatusIcon('fwa')"></i>
              {{ getStatusText('fwa') }}
            </div>
            <div class="tech-details">
              <span class="tech-speed">150 Mbps</span>
              <span class="tech-latency">~25ms</span>
            </div>
          </div>
          <div class="tech-badge" :class="getBadgeClass('fwa')">
            {{ getBadgeText('fwa') }}
          </div>
        </div>
      </div>

      <!-- Alternative Technology Notice -->
      <div v-if="showAlternativeNotice" class="alternative-notice">
        <div class="notice-header">
          <i class="bi bi-lightbulb"></i>
          <h5>Alternatif Teknoloji Önerisi</h5>
        </div>
        <div class="notice-content">
          <p class="notice-text">
            <strong>Fiber internet</strong> bu adreste mevcut değil, ancak
            <strong>{{ getAlternativeTechnologies() }}</strong> teknolojileri kullanılabilir.
          </p>
          <div class="alternative-benefits">
            <div class="benefit-item">
              <i class="bi bi-check-circle"></i>
              <span>Hızlı kurulum</span>
            </div>
            <div class="benefit-item">
              <i class="bi bi-check-circle"></i>
              <span>Uygun fiyat</span>
            </div>
            <div class="benefit-item">
              <i class="bi bi-check-circle"></i>
              <span>Güvenilir bağlantı</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Coverage Summary -->
      <div class="coverage-summary">
        <div class="summary-header">
          <i class="bi bi-info-circle"></i>
          <h5>Kapsama Özeti</h5>
        </div>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">Mevcut Teknolojiler:</span>
            <span class="summary-value">{{ getAvailableTechnologies() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Önerilen Teknoloji:</span>
            <span class="summary-value recommended">{{ getRecommendedTechnology() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Kurulum Süresi:</span>
            <span class="summary-value">{{ getInstallationTime() }}</span>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps">
        <div class="steps-header">
          <i class="bi bi-arrow-right-circle"></i>
          <h5>Sonraki Adımlar</h5>
        </div>
        <div class="steps-content">
          <p class="steps-text">
            Kapsama kontrolü tamamlandı. Şimdi size en uygun paketi seçebilir ve randevu
            alabilirsiniz.
          </p>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="no-data-state">
      <div class="no-data-icon">
        <i class="bi bi-search"></i>
      </div>
      <h5 class="no-data-title">Kapsama Bilgisi Bulunamadı</h5>
      <p class="no-data-message">
        Belirtilen adres için kapsama bilgisi mevcut değil. Lütfen adres bilgilerinizi kontrol edin.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Props
const props = defineProps({
  addressId: {
    type: String,
    required: true,
  },
})

// Reactive state
const loading = ref(true)
const error = ref(null)
const coverageData = ref(null)
const allCoverageData = ref([])

// Computed properties
const showAlternativeNotice = computed(() => {
  if (!coverageData.value) return false
  return (
    coverageData.value.fiber === 0 &&
    (coverageData.value.vdsl === 1 || coverageData.value.fwa === 1)
  )
})

// Methods
const loadCoverageData = async () => {
  try {
    loading.value = true
    error.value = null

    // Mock coverage data - in real app this would be loaded from CSV
    const mockData = [
      {
        address_id: 'IST_KAD_001',
        city: 'İstanbul',
        district: 'Kadıköy',
        fiber: 1,
        vdsl: 1,
        fwa: 1,
      },
      {
        address_id: 'IST_KAD_002',
        city: 'İstanbul',
        district: 'Kadıköy',
        fiber: 0,
        vdsl: 1,
        fwa: 1,
      },
      {
        address_id: 'IST_KAD_003',
        city: 'İstanbul',
        district: 'Kadıköy',
        fiber: 0,
        vdsl: 0,
        fwa: 1,
      },
      {
        address_id: 'IST_BES_001',
        city: 'İstanbul',
        district: 'Beşiktaş',
        fiber: 1,
        vdsl: 1,
        fwa: 1,
      },
      {
        address_id: 'IST_BES_002',
        city: 'İstanbul',
        district: 'Beşiktaş',
        fiber: 1,
        vdsl: 0,
        fwa: 0,
      },
      { address_id: 'IST_SIS_001', city: 'İstanbul', district: 'Şişli', fiber: 0, vdsl: 1, fwa: 1 },
      { address_id: 'IST_SIS_002', city: 'İstanbul', district: 'Şişli', fiber: 1, vdsl: 1, fwa: 0 },
      { address_id: 'ANK_CAN_001', city: 'Ankara', district: 'Çankaya', fiber: 1, vdsl: 1, fwa: 1 },
      { address_id: 'ANK_CAN_002', city: 'Ankara', district: 'Çankaya', fiber: 0, vdsl: 1, fwa: 1 },
      {
        address_id: 'ANK_KEC_001',
        city: 'Ankara',
        district: 'Keçiören',
        fiber: 0,
        vdsl: 0,
        fwa: 1,
      },
      {
        address_id: 'ANK_KEC_002',
        city: 'Ankara',
        district: 'Keçiören',
        fiber: 0,
        vdsl: 1,
        fwa: 0,
      },
      { address_id: 'IZM_KON_001', city: 'İzmir', district: 'Konak', fiber: 1, vdsl: 1, fwa: 1 },
      { address_id: 'IZM_KON_002', city: 'İzmir', district: 'Konak', fiber: 0, vdsl: 1, fwa: 1 },
    ]

    allCoverageData.value = mockData

    // Find coverage data for the specific address
    const found = mockData.find((item) => item.address_id === props.addressId)

    if (found) {
      coverageData.value = found
    } else {
      error.value = `Adres ID "${props.addressId}" için kapsama bilgisi bulunamadı`
    }
  } catch (err) {
    error.value = 'Kapsama verileri yüklenirken hata oluştu: ' + err.message
  } finally {
    loading.value = false
  }
}

const getCardClass = (technology) => {
  if (!coverageData.value) return 'tech-card-unavailable'

  const isAvailable = coverageData.value[technology] === 1
  return isAvailable ? 'tech-card-available' : 'tech-card-unavailable'
}

const getStatusClass = (technology) => {
  if (!coverageData.value) return 'status-unknown'

  const isAvailable = coverageData.value[technology] === 1
  return isAvailable ? 'status-available' : 'status-unavailable'
}

const getStatusIcon = (technology) => {
  if (!coverageData.value) return 'bi bi-question-circle'

  const isAvailable = coverageData.value[technology] === 1
  return isAvailable ? 'bi bi-check-circle' : 'bi bi-x-circle'
}

const getStatusText = (technology) => {
  if (!coverageData.value) return 'Bilinmiyor'

  const isAvailable = coverageData.value[technology] === 1
  return isAvailable ? 'Mevcut' : 'Mevcut Değil'
}

const getBadgeClass = (technology) => {
  if (!coverageData.value) return 'badge-unavailable'

  const isAvailable = coverageData.value[technology] === 1

  switch (technology) {
    case 'fiber':
      return isAvailable ? 'badge-fiber' : 'badge-unavailable'
    case 'vdsl':
      return isAvailable ? 'badge-vdsl' : 'badge-unavailable'
    case 'fwa':
      return isAvailable ? 'badge-fwa' : 'badge-unavailable'
    default:
      return 'badge-unavailable'
  }
}

const getBadgeText = (technology) => {
  if (!coverageData.value) return 'Bilinmiyor'

  const isAvailable = coverageData.value[technology] === 1

  switch (technology) {
    case 'fiber':
      return isAvailable ? 'Fiber Uygun' : 'Fiber Yok'
    case 'vdsl':
      return isAvailable ? 'VDSL Uygun' : 'VDSL Yok'
    case 'fwa':
      return isAvailable ? 'FWA Uygun' : 'FWA Yok'
    default:
      return 'Bilinmiyor'
  }
}

const getAlternativeTechnologies = () => {
  if (!coverageData.value) return ''

  const alternatives = []
  if (coverageData.value.vdsl === 1) alternatives.push('VDSL')
  if (coverageData.value.fwa === 1) alternatives.push('FWA')

  return alternatives.join(' / ')
}

const getAvailableTechnologies = () => {
  if (!coverageData.value) return 'Bilinmiyor'

  const available = []
  if (coverageData.value.fiber === 1) available.push('Fiber')
  if (coverageData.value.vdsl === 1) available.push('VDSL')
  if (coverageData.value.fwa === 1) available.push('FWA')

  return available.length > 0 ? available.join(', ') : 'Hiçbiri'
}

const getRecommendedTechnology = () => {
  if (!coverageData.value) return 'Bilinmiyor'

  // Priority: Fiber > VDSL > FWA
  if (coverageData.value.fiber === 1) return 'Fiber (En Hızlı)'
  if (coverageData.value.vdsl === 1) return 'VDSL (Orta Hız)'
  if (coverageData.value.fwa === 1) return 'FWA (Sabit Kablosuz)'

  return 'Uygun Teknoloji Yok'
}

const getInstallationTime = () => {
  if (!coverageData.value) return 'Bilinmiyor'

  // Priority: Fiber > VDSL > FWA
  if (coverageData.value.fiber === 1) return '1-3 iş günü'
  if (coverageData.value.vdsl === 1) return '2-5 iş günü'
  if (coverageData.value.fwa === 1) return '1-2 iş günü'

  return 'Belirlenemedi'
}

// Lifecycle
onMounted(() => {
  loadCoverageData()
})

// Watch for addressId changes
watch(
  () => props.addressId,
  (newAddressId) => {
    if (newAddressId) {
      loadCoverageData()
    }
  },
)
</script>

<style scoped>
.coverage-container {
  color: var(--color-text);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.loading-spinner i {
  font-size: 2rem;
  color: white;
}

.loading-text {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.loading-subtext {
  color: var(--color-text-mute);
  font-size: 0.9rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-background-soft);
  border-radius: 16px;
  border: 2px solid var(--color-error-light);
}

.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: var(--color-error-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon i {
  font-size: 2rem;
  color: var(--color-error);
}

.error-title {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-text-mute);
  margin-bottom: 1.5rem;
}

/* Coverage Header */
.coverage-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-primary-lighter), var(--color-primary-light));
  border-radius: 20px;
  margin-bottom: 2rem;
  border: 1px solid var(--color-primary-light);
}

.header-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon i {
  font-size: 2.5rem;
  color: white;
}

.header-content {
  flex: 1;
}

.header-title {
  color: var(--color-primary-dark);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.header-subtitle {
  color: var(--color-text-mute);
  margin-bottom: 1rem;
}

.address-info {
  display: flex;
  gap: 0.5rem;
}

.address-badge {
  background: var(--color-background-card);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid var(--color-primary-light);
}

/* Technology Grid */
.technology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tech-card {
  background: var(--color-background-card);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-border);
  transition: all 0.3s ease;
}

.tech-card-available {
  border-color: var(--color-success-light);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tech-card-available::before {
  background: var(--color-success);
}

.tech-card-unavailable {
  border-color: var(--color-border);
  opacity: 0.7;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.tech-icon {
  width: 60px;
  height: 60px;
  background: var(--color-background-soft);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.tech-icon i {
  font-size: 1.8rem;
  color: var(--color-primary);
}

.tech-content {
  margin-bottom: 1rem;
}

.tech-title {
  color: var(--color-text);
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.tech-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.status-available {
  color: var(--color-success);
}

.status-unavailable {
  color: var(--color-error);
}

.status-unknown {
  color: var(--color-text-mute);
}

.tech-details {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-mute);
}

.tech-speed {
  background: var(--color-background-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.tech-latency {
  background: var(--color-background-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.tech-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
}

.badge-fiber {
  background: var(--color-success);
  color: white;
}

.badge-vdsl {
  background: var(--color-primary);
  color: white;
}

.badge-fwa {
  background: var(--color-warning);
  color: white;
}

.badge-unavailable {
  background: var(--color-text-mute);
  color: white;
}

/* Alternative Notice */
.alternative-notice {
  background: linear-gradient(135deg, var(--color-warning-lightest), var(--color-warning-light));
  border: 2px solid var(--color-warning);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.notice-header i {
  font-size: 1.5rem;
  color: var(--color-warning);
}

.notice-header h5 {
  color: var(--color-warning-dark);
  margin: 0;
}

.notice-text {
  color: var(--color-warning-dark);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.alternative-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-warning-dark);
  font-size: 0.9rem;
}

.benefit-item i {
  color: var(--color-warning);
}

/* Coverage Summary */
.coverage-summary {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-header i {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.summary-header h5 {
  color: var(--color-primary);
  margin: 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-background-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.summary-label {
  color: var(--color-text-mute);
  font-weight: 500;
}

.summary-value {
  color: var(--color-text);
  font-weight: 600;
}

.summary-value.recommended {
  color: var(--color-success);
}

/* Next Steps */
.next-steps {
  background: linear-gradient(135deg, var(--color-success-lightest), var(--color-success-light));
  border: 2px solid var(--color-success);
  border-radius: 16px;
  padding: 1.5rem;
}

.steps-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.steps-header i {
  font-size: 1.5rem;
  color: var(--color-success);
}

.steps-header h5 {
  color: var(--color-success-dark);
  margin: 0;
}

.steps-text {
  color: var(--color-success-dark);
  margin: 0;
  line-height: 1.6;
}

/* No Data State */
.no-data-state {
  text-align: center;
  padding: 3rem 2rem;
}

.no-data-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: var(--color-background-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-icon i {
  font-size: 2rem;
  color: var(--color-text-mute);
}

.no-data-title {
  color: var(--color-text-mute);
  margin-bottom: 1rem;
}

.no-data-message {
  color: var(--color-text-light);
  max-width: 400px;
  margin: 0 auto;
}

/* Animations */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .coverage-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .technology-grid {
    grid-template-columns: 1fr;
  }

  .alternative-benefits {
    flex-direction: column;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

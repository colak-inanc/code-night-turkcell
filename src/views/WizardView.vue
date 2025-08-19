<template>
  <div class="min-h-screen bg-light py-4">
    <div class="container">
      <!-- Header -->

      <!-- Progress Steps -->
      <div class="row justify-content-center mb-5">
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <div class="progress-step active">1</div>
              <span class="ms-2 text-primary fw-bold">Hane & Adres</span>
            </div>
            <div
              class="progress-line"
              :class="{ active: showRecommendations || showCoverage }"
            ></div>
            <div class="d-flex align-items-center">
              <div
                class="progress-step"
                :class="{ active: showRecommendations, completed: showCoverage }"
              >
                2
              </div>
              <span
                class="ms-2"
                :class="{
                  'text-primary fw-bold': showRecommendations || showCoverage,
                  'text-muted': !showRecommendations && !showCoverage,
                }"
                >Öneriler</span
              >
            </div>
            <div class="progress-line" :class="{ active: showCoverage }"></div>
            <div class="d-flex align-items-center">
              <div class="progress-step" :class="{ active: showCoverage, completed: showCoverage }">
                3
              </div>
              <span
                class="ms-2"
                :class="{ 'text-primary fw-bold': showCoverage, 'text-muted': !showCoverage }"
                >Kapsama</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1: Form (Hidden when showing recommendations or coverage) -->
      <div v-if="!showRecommendations && !showCoverage" class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header py-3">
              <h4 class="mb-0">
                <i class="bi bi-house-door me-2"></i>
                Hane Profili & Adres Bilgileri
              </h4>
            </div>
            <div class="card-body py-4">
              <!-- Address Selection -->
              <div class="row mb-4">
                <div class="col-md-6 mb-3">
                  <label for="city" class="form-label fw-bold">Şehir *</label>
                  <select
                    id="city"
                    v-model="wizardStore.city"
                    @change="wizardStore.setCity($event.target.value)"
                    class="form-select form-select-sm"
                    required
                  >
                    <option value="">Şehir seçiniz</option>
                    <option v-for="city in wizardStore.cities" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="district" class="form-label fw-bold">İlçe *</label>
                  <select
                    id="district"
                    v-model="wizardStore.district"
                    @change="wizardStore.setDistrict($event.target.value)"
                    class="form-select form-select-sm"
                    :disabled="!wizardStore.city"
                    required
                  >
                    <option value="">İlçe seçiniz</option>
                    <option
                      v-for="district in wizardStore.availableDistricts"
                      :key="district"
                      :value="district"
                    >
                      {{ district }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Household Members Count -->
              <div class="row mb-4">
                <div class="col-md-6 mb-3">
                  <label for="householdMembers" class="form-label fw-bold">
                    <i class="bi bi-people me-2"></i>
                    Hane Üyeleri Sayısı *
                  </label>
                  <input
                    id="householdMembers"
                    type="number"
                    v-model.number="wizardStore.householdMembers"
                    @input="wizardStore.setHouseholdMembers($event.target.value)"
                    min="1"
                    max="10"
                    class="form-control form-control-sm"
                    placeholder="Örn: 4"
                    required
                  />
                  <div class="form-text">Hane içinde yaşayan toplam kişi sayısı</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="activeLines" class="form-label fw-bold">
                    <i class="bi bi-phone me-2"></i>
                    Aktif Mobil Hat Sayısı *
                  </label>
                  <input
                    id="activeLines"
                    type="number"
                    v-model.number="wizardStore.activeLines"
                    @input="wizardStore.setActiveLines($event.target.value)"
                    min="1"
                    max="5"
                    class="form-control form-control-sm"
                    placeholder="Örn: 3"
                    required
                  />
                  <div class="form-text">Şu anda aktif olan mobil hat sayısı</div>
                </div>
              </div>

              <!-- Household Lines -->
              <div class="mb-4">
                <h5 class="mb-3">
                  <i class="bi bi-phone me-2"></i>
                  Mobil Hat Detayları
                </h5>
                <p class="text-muted small mb-3">
                  Her hat için aylık GB, dakika ve TV izleme sürelerini belirtin
                </p>

                <div
                  class="row g-3"
                  v-for="(line, index) in wizardStore.household"
                  :key="line.line_id"
                >
                  <div class="col-12">
                    <div class="card border-primary-light bg-light">
                      <div class="card-body py-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <h6 class="mb-0 text-primary">{{ line.line_id }}</h6>
                          <button
                            v-if="wizardStore.household.length > 1"
                            @click="wizardStore.removeHouseholdLine(index)"
                            type="button"
                            class="btn btn-outline-danger btn-sm"
                            title="Bu hattı kaldır"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>

                        <div class="row g-2">
                          <div class="col-md-4">
                            <label :for="`gb-${index}`" class="form-label small">GB İhtiyacı</label>
                            <input
                              :id="`gb-${index}`"
                              type="number"
                              v-model.number="line.expected_gb"
                              @input="
                                wizardStore.updateHouseholdLine(
                                  index,
                                  'expected_gb',
                                  $event.target.value,
                                )
                              "
                              min="1"
                              max="1000"
                              class="form-control form-control-sm"
                              placeholder="10"
                            />
                          </div>

                          <div class="col-md-4">
                            <label :for="`min-${index}`" class="form-label small"
                              >Dakika İhtiyacı</label
                            >
                            <input
                              :id="`min-${index}`"
                              type="number"
                              v-model.number="line.expected_min"
                              @input="
                                wizardStore.updateHouseholdLine(
                                  index,
                                  'expected_min',
                                  $event.target.value,
                                )
                              "
                              min="0"
                              max="10000"
                              class="form-control form-control-sm"
                              placeholder="500"
                            />
                          </div>

                          <div class="col-md-4">
                            <label :for="`tv-${index}`" class="form-label small"
                              >Ortalama TV İzleme Saati</label
                            >
                            <input
                              :id="`tv-${index}`"
                              type="number"
                              v-model.number="line.tv_hd_hours"
                              @input="
                                wizardStore.updateHouseholdLine(
                                  index,
                                  'tv_hd_hours',
                                  $event.target.value,
                                )
                              "
                              min="0"
                              max="24"
                              class="form-control form-control-sm"
                              placeholder="4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-center mt-3">
                  <button
                    @click="wizardStore.addHouseholdLine"
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="bi bi-plus-circle me-2"></i>
                    Yeni Hat Ekle
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <div class="d-flex gap-2">
                  <RouterLink to="/onboarding" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-house me-2"></i>
                    Ana Menüye Dön
                  </RouterLink>

                  <button
                    @click="wizardStore.resetWizard"
                    type="button"
                    class="btn btn-outline-warning btn-sm"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Sıfırla
                  </button>
                </div>

                <button
                  @click="handleContinue"
                  :disabled="!wizardStore.canContinue"
                  type="button"
                  class="btn btn-primary"
                >
                  Devam Et
                  <i class="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Recommendation Cards -->
      <div v-if="showRecommendations && !showCoverage" class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow-sm">
            <div class="card-header py-3">
              <h4 class="mb-0">
                <i class="bi bi-lightbulb me-2"></i>
                Paket Önerileri
              </h4>
            </div>
            <div class="card-body py-4">
              <RecommendationCards
                :householdData="{
                  city: wizardStore.city,
                  district: wizardStore.district,
                  household: wizardStore.household,
                }"
                :addressId="wizardStore.getMockAddressId()"
                @select-recommendation="handleSelectRecommendation"
                @show-details="handleShowDetails"
              />
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="d-flex justify-content-between align-items-center mt-4">
            <button @click="goBack" type="button" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Geri Dön
            </button>

            <button
              @click="continueToCoverage"
              :disabled="!selectedRecommendation"
              type="button"
              class="btn btn-primary"
            >
              Kapsama Kontrolü
              <i class="bi bi-wifi ms-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Coverage Badges -->
      <div v-if="showCoverage" class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header py-3">
              <h4 class="mb-0">
                <i class="bi bi-wifi me-2"></i>
                Adres Kapsama Durumu
              </h4>
            </div>
            <div class="card-body py-4">
              <CoverageBadge :addressId="wizardStore.getMockAddressId()" />
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="d-flex justify-content-between align-items-center mt-4">
            <button @click="goBack" type="button" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Geri Dön
            </button>

            <button @click="continueToAppointment" type="button" class="btn btn-primary">
              Randevu Seç
              <i class="bi bi-calendar-check ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Appointment Modal -->
  <div v-if="showAppointmentModal" class="appointment-modal-overlay" @click="closeAppointmentModal">
    <div class="appointment-modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="header-text">
            <h4 class="modal-title">Randevu Seçimi</h4>
            <p class="modal-subtitle">Kurulum için uygun tarih ve saati seçin</p>
          </div>
        </div>
        <button class="modal-close" @click="closeAppointmentModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- Date Selection -->
        <div class="date-section">
          <h5 class="section-title">
            <i class="bi bi-calendar-week me-2"></i>
            Tarih Seçimi
          </h5>
          <div class="date-grid">
            <div
              v-for="date in availableDates"
              :key="date.value"
              class="date-option"
              :class="{ active: selectedDate === date.value }"
              @click="selectDate(date.value)"
            >
              <div class="date-day">{{ date.day }}</div>
              <div class="date-number">{{ date.number }}</div>
              <div class="date-month">{{ date.month }}</div>
            </div>
          </div>
        </div>

        <!-- Time Selection -->
        <div class="time-section">
          <h5 class="section-title">
            <i class="bi bi-clock me-2"></i>
            Saat Seçimi
          </h5>
          <div class="time-grid">
            <div
              v-for="time in availableTimes"
              :key="time.value"
              class="time-option"
              :class="{ active: selectedTime === time.value }"
              @click="selectTime(time.value)"
            >
              {{ time.label }}
            </div>
          </div>
        </div>

        <!-- Appointment Summary -->
        <div class="appointment-summary">
          <div class="summary-header">
            <i class="bi bi-info-circle me-2"></i>
            <h6>Randevu Özeti</h6>
          </div>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Seçilen Tarih:</span>
              <span class="summary-value">{{ getSelectedDateText() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Seçilen Saat:</span>
              <span class="summary-value">{{ getSelectedTimeText() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Kurulum Süresi:</span>
              <span class="summary-value">2-4 saat</span>
            </div>
          </div>
        </div>

        <!-- Additional Notes -->
        <div class="notes-section">
          <label for="appointment-notes" class="form-label">
            <i class="bi bi-chat-text me-2"></i>
            Ek Notlar (Opsiyonel)
          </label>
          <textarea
            id="appointment-notes"
            v-model="appointmentNotes"
            class="form-control"
            rows="3"
            placeholder="Kurulum ekibi için özel notlarınızı buraya yazabilirsiniz..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline-secondary" @click="closeAppointmentModal">
          <i class="bi bi-x me-2"></i>
          İptal
        </button>
        <button
          class="btn btn-primary"
          :disabled="!selectedDate || !selectedTime"
          @click="confirmAppointment"
        >
          <i class="bi bi-check-lg me-2"></i>
          Randevuyu Onayla
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWizardStore } from '@/stores/useWizardStore'
import CoverageBadge from '@/components/CoverageBadge.vue'
import RecommendationCards from '@/components/RecommendationCards.vue'

// Props
const props = defineProps({
  initialStep: {
    type: String,
    default: 'form',
    validator: (value) => ['form', 'recommendations', 'coverage'].includes(value),
  },
})

const router = useRouter()
const route = useRoute()
const wizardStore = useWizardStore()

// State
const showCoverage = ref(false)
const showRecommendations = ref(false)
const selectedRecommendation = ref(null)
const showAppointmentModal = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')
const appointmentNotes = ref('')

// Initialize step based on props or route
onMounted(() => {
  const step = props.initialStep || route.name?.replace('wizard-step', '') || 'form'
  setStep(step)
})

// Set step and update URL
const setStep = (step) => {
  showRecommendations.value = false
  showCoverage.value = false

  switch (step) {
    case '1':
    case 'form':
      // Stay on form
      break
    case '2':
    case 'recommendations':
      showRecommendations.value = true
      if (route.path !== '/wizard/step2') router.push('/wizard/step2')
      break
    case '3':
    case 'coverage':
      showRecommendations.value = true
      showCoverage.value = true
      if (route.path !== '/wizard/step3') router.push('/wizard/step3')
      break
  }
}

// Watch for route changes
watch(
  () => route.name,
  (newRoute) => {
    if (newRoute && newRoute.startsWith('wizard-step')) {
      const step = newRoute.replace('wizard-step', '')
      setStep(step)
    }
  },
)

const handleContinue = () => {
  if (wizardStore.canContinue) {
    console.log('Form Data:', {
      city: wizardStore.city,
      district: wizardStore.district,
      householdMembers: wizardStore.householdMembers,
      activeLines: wizardStore.activeLines,
      household: wizardStore.household,
    })
    showRecommendations.value = true
    router.push('/wizard/step2')
  }
}

const continueToCoverage = () => {
  showRecommendations.value = false
  showCoverage.value = true
  router.push('/wizard/step3')
}

const goBack = () => {
  if (showCoverage.value) {
    showCoverage.value = false
    showRecommendations.value = true
    router.push('/wizard/step2')
  } else if (showRecommendations.value) {
    showRecommendations.value = false
    router.push('/wizard/step1')
  } else {
    router.push('/onboarding')
  }
}

const handleSelectRecommendation = (recommendation) => {
  selectedRecommendation.value = recommendation
  console.log('Selected recommendation:', recommendation)
}

const handleShowDetails = (recommendation) => {
  console.log('Show details for:', recommendation)
  // TODO: Show detailed modal
}

// Available dates for the next 2 weeks
const availableDates = ref([
  { value: '2024-01-15', day: 'Pzt', number: '15', month: 'Oca' },
  { value: '2024-01-16', day: 'Sal', number: '16', month: 'Oca' },
  { value: '2024-01-17', day: 'Çar', number: '17', month: 'Oca' },
  { value: '2024-01-18', day: 'Per', number: '18', month: 'Oca' },
  { value: '2024-01-19', day: 'Cum', number: '19', month: 'Oca' },
  { value: '2024-01-22', day: 'Pzt', number: '22', month: 'Oca' },
  { value: '2024-01-23', day: 'Sal', number: '23', month: 'Oca' },
  { value: '2024-01-24', day: 'Çar', number: '24', month: 'Oca' },
  { value: '2024-01-25', day: 'Per', number: '25', month: 'Oca' },
  { value: '2024-01-26', day: 'Cum', number: '26', month: 'Oca' },
])

// Available time slots
const availableTimes = ref([
  { value: '09:00', label: '09:00 - 11:00' },
  { value: '11:00', label: '11:00 - 13:00' },
  { value: '13:00', label: '13:00 - 15:00' },
  { value: '15:00', label: '15:00 - 17:00' },
  { value: '17:00', label: '17:00 - 19:00' },
])

const continueToAppointment = () => {
  showAppointmentModal.value = true
}

const closeAppointmentModal = () => {
  showAppointmentModal.value = false
  selectedDate.value = ''
  selectedTime.value = ''
  appointmentNotes.value = ''
}

const selectDate = (date) => {
  selectedDate.value = date
}

const selectTime = (time) => {
  selectedTime.value = time
}

const getSelectedDateText = () => {
  if (!selectedDate.value) return 'Seçilmedi'
  const date = availableDates.value.find((d) => d.value === selectedDate.value)
  return date ? `${date.number} ${date.month} ${date.day}` : 'Seçilmedi'
}

const getSelectedTimeText = () => {
  if (!selectedTime.value) return 'Seçilmedi'
  const time = availableTimes.value.find((t) => t.value === selectedTime.value)
  return time ? time.label : 'Seçilmedi'
}

const confirmAppointment = () => {
  if (selectedDate.value && selectedTime.value) {
    // Show success message
    alert(
      `✅ Randevunuz başarıyla oluşturuldu!\n\n📅 Tarih: ${getSelectedDateText()}\n🕐 Saat: ${getSelectedTimeText()}\n\nKurulum ekibi belirtilen tarih ve saatte adresinizde olacaktır.`,
    )

    // Close modal and reset
    closeAppointmentModal()

    // Navigate to success page or reset wizard
    router.push('/onboarding')
  }
}
</script>

<style scoped>
.bg-light {
  background-color: var(--color-background-soft) !important;
}

.border-primary-light {
  border-color: var(--color-primary-lighter) !important;
}

.text-primary {
  color: var(--color-primary) !important;
}

.text-muted {
  color: var(--color-text-light) !important;
}

.bg-primary-light {
  background-color: var(--color-primary-lighter) !important;
}

/* Appointment Modal Styles */
.appointment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.appointment-modal-content {
  background: var(--color-background-card);
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid var(--color-border);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 2px solid var(--color-border);
  background: linear-gradient(135deg, var(--color-primary-lighter), var(--color-primary-light));
  border-radius: 24px 24px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon i {
  font-size: 1.8rem;
  color: white;
}

.header-text {
  flex: 1;
}

.modal-title {
  color: var(--color-primary-dark);
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-subtitle {
  color: var(--color-text-mute);
  margin: 0;
  font-size: 0.95rem;
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-mute);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: var(--color-background-soft);
  color: var(--color-text);
}

.modal-body {
  padding: 2rem;
}

.section-title {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.date-section,
.time-section {
  margin-bottom: 2rem;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.date-option {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 1rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.date-option:hover {
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.date-option.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.date-day {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  opacity: 0.8;
}

.date-number {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.date-month {
  font-size: 0.75rem;
  opacity: 0.8;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.time-option {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.time-option:hover {
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.time-option.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.appointment-summary {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-header h6 {
  color: var(--color-primary);
  margin: 0;
  font-weight: 600;
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

.notes-section {
  margin-bottom: 2rem;
}

.notes-section .form-label {
  color: var(--color-text);
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.notes-section .form-control {
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-input);
  color: var(--color-text);
  transition: all 0.3s ease;
}

.notes-section .form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  background: var(--color-background-card);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem;
  border-top: 2px solid var(--color-border);
  background: var(--color-background-soft);
  border-radius: 0 0 24px 24px;
}

.modal-footer .btn {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-footer .btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .appointment-modal-content {
    max-width: 95vw;
    margin: 1rem;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .date-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }

  .time-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>

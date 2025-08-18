<template>
  <div class="min-h-screen bg-light py-4">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5">
        <h1 class="text-primary mb-2">Turkcell Ev+Mobil Paket Danışmanı</h1>
        <p class="text-muted fs-5">
          Size en uygun paketi bulmak için birkaç bilgiye ihtiyacımız var
        </p>
      </div>

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
                <div class="col-md-4 mb-3">
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

                <div class="col-md-4 mb-3">
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

                <div class="col-md-4 mb-3">
                  <label for="address" class="form-label fw-bold">Adres ID *</label>
                  <select
                    id="address"
                    v-model="wizardStore.addressId"
                    @change="wizardStore.setAddressId($event.target.value)"
                    class="form-select form-select-sm"
                    :disabled="!wizardStore.district"
                    required
                  >
                    <option value="">Adres seçiniz</option>
                    <option
                      v-for="address in wizardStore.availableAddresses"
                      :key="address.id"
                      :value="address.id"
                    >
                      {{ address.street }} {{ address.building }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Household Lines -->
              <div class="mb-4">
                <h5 class="mb-3">
                  <i class="bi bi-people me-2"></i>
                  Hane Hat Bilgileri
                </h5>

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
                            <label :for="`tv-${index}`" class="form-label small">TV HD Saat</label>
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
                <button
                  @click="wizardStore.resetWizard"
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                >
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Sıfırla
                </button>

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
                  addressId: wizardStore.addressId,
                  household: wizardStore.household,
                }"
                :addressId="wizardStore.addressId"
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
              <CoverageBadge :addressId="wizardStore.addressId" />
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
</template>

<script setup>
import { ref } from 'vue'
import { useWizardStore } from '@/stores/useWizardStore'
import CoverageBadge from '@/components/CoverageBadge.vue'
import RecommendationCards from '@/components/RecommendationCards.vue'

const wizardStore = useWizardStore()
const showCoverage = ref(false)
const showRecommendations = ref(false)
const selectedRecommendation = ref(null)

const handleContinue = () => {
  if (wizardStore.canContinue) {
    const formData = wizardStore.getFormData()
    console.log('Form Data:', formData)
    showRecommendations.value = true
  }
}

const continueToCoverage = () => {
  showRecommendations.value = false
  showCoverage.value = true
}

const goBack = () => {
  if (showCoverage.value) {
    showCoverage.value = false
    showRecommendations.value = true
  } else if (showRecommendations.value) {
    showRecommendations.value = false
  } else {
    window.history.back()
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

const continueToAppointment = () => {
  console.log('Moving to appointment step with:', selectedRecommendation.value)
  // TODO: Navigate to appointment selection
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
</style>

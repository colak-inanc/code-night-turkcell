import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWizardStore = defineStore('wizard', () => {
  // State
  const city = ref('')
  const district = ref('')
  const householdMembers = ref(1)
  const activeLines = ref(1)
  const household = ref([
    {
      line_id: 'Ana Hat',
      expected_gb: 10,
      expected_min: 500,
      tv_hd_hours: 4,
    },
  ])

  // Cities and Districts data
  const cities = ref([
    'İstanbul',
    'Ankara',
    'İzmir',
    'Bursa',
    'Antalya',
    'Adana',
    'Konya',
    'Gaziantep',
    'Mersin',
    'Diyarbakır',
  ])

  const districtsByCity = ref({
    İstanbul: ['Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Üsküdar', 'Maltepe', 'Ataşehir'],
    Ankara: ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Etimesgut', 'Sincan'],
    İzmir: ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Çiğli', 'Bayraklı'],
    Bursa: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'Gürsu'],
    Antalya: ['Muratpaşa', 'Kepez', 'Döşemealtı', 'Aksu', 'Konyaaltı'],
    Adana: ['Seyhan', 'Çukurova', 'Sarıçam', 'Karaisalı'],
    Konya: ['Selçuklu', 'Meram', 'Karatay', 'Cumra', 'Ereğli'],
    Gaziantep: ['Şahinbey', 'Şehitkamil', 'Oğuzeli', 'Nizip'],
    Mersin: ['Yenişehir', 'Akdeniz', 'Toroslar', 'Mezitli'],
    Diyarbakır: ['Bağlar', 'Kayapınar', 'Sur', 'Yenişehir'],
  })

  // Computed
  const availableDistricts = computed(() => {
    if (!city.value) return []
    return districtsByCity.value[city.value] || []
  })

  const canContinue = computed(() => {
    return city.value && district.value && householdMembers.value > 0 && activeLines.value > 0
  })

  // Actions
  const setCity = (newCity) => {
    city.value = newCity
    district.value = '' // Reset district when city changes
  }

  const setDistrict = (newDistrict) => {
    district.value = newDistrict
  }

  const setHouseholdMembers = (count) => {
    householdMembers.value = Math.max(1, Math.min(10, parseInt(count) || 1))
  }

  const setActiveLines = (count) => {
    const newCount = Math.max(1, Math.min(5, parseInt(count) || 1))
    activeLines.value = newCount

    // Auto-adjust household lines based on active lines
    if (newCount > household.value.length) {
      // Add more lines
      for (let i = household.value.length; i < newCount; i++) {
        addHouseholdLine()
      }
    } else if (newCount < household.value.length) {
      // Remove excess lines
      household.value.splice(newCount)
      // Rename remaining lines
      const lineNames = ['Ana Hat', 'İkinci Hat', 'Üçüncü Hat', 'Dördüncü Hat', 'Beşinci Hat']
      household.value.forEach((line, idx) => {
        line.line_id = lineNames[idx] || `${idx + 1}. Hat`
      })
    }
  }

  const addHouseholdLine = () => {
    if (household.value.length < 5) {
      const newLineNumber = household.value.length + 1
      const lineNames = ['Ana Hat', 'İkinci Hat', 'Üçüncü Hat', 'Dördüncü Hat', 'Beşinci Hat']
      const lineName = lineNames[newLineNumber - 1] || `${newLineNumber}. Hat`
      household.value.push({
        line_id: lineName,
        expected_gb: 10,
        expected_min: 500,
        tv_hd_hours: 4,
      })
    }
  }

  const removeHouseholdLine = (index) => {
    if (household.value.length > 1) {
      household.value.splice(index, 1)
      const lineNames = ['Ana Hat', 'İkinci Hat', 'Üçüncü Hat', 'Dördüncü Hat', 'Beşinci Hat']
      household.value.forEach((line, idx) => {
        line.line_id = lineNames[idx] || `${idx + 1}. Hat`
      })
      // Update active lines count
      activeLines.value = household.value.length
    }
  }

  const updateHouseholdLine = (index, field, value) => {
    if (household.value[index]) {
      household.value[index][field] = value
    }
  }

  const getMockAddressId = () => {
    if (!city.value || !district.value) return null
    const cityCode = city.value.substring(0, 3).toUpperCase()
    const districtCode = district.value.substring(0, 3).toUpperCase()
    return `${cityCode}_${districtCode}_001`
  }

  const resetWizard = () => {
    city.value = ''
    district.value = ''
    householdMembers.value = 1
    activeLines.value = 1
    household.value = [
      {
        line_id: 'Ana Hat',
        expected_gb: 10,
        expected_min: 500,
        tv_hd_hours: 4,
      },
    ]
  }

  return {
    // State
    city,
    district,
    householdMembers,
    activeLines,
    household,
    cities,
    districtsByCity,

    // Computed
    availableDistricts,
    canContinue,

    // Actions
    setCity,
    setDistrict,
    setHouseholdMembers,
    setActiveLines,
    addHouseholdLine,
    removeHouseholdLine,
    updateHouseholdLine,
    getMockAddressId,
    resetWizard,
  }
})

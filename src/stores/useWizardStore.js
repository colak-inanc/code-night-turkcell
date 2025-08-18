import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWizardStore = defineStore('wizard', () => {
  // State
  const city = ref('')
  const district = ref('')
  const addressId = ref('')
  const household = ref([
    {
      line_id: 'L-1',
      expected_gb: 10,
      expected_min: 500,
      tv_hd_hours: 4
    }
  ])

  // Mock data for cities, districts, and addresses
  const cities = ref([
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep'
  ])

  const districts = ref({
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar'],
    'Ankara': ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Etimesgut'],
    'İzmir': ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Çiğli'],
    'Bursa': ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya'],
    'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Aksu'],
    'Adana': ['Seyhan', 'Çukurova', 'Sarıçam', 'Karaisalı'],
    'Konya': ['Selçuklu', 'Karatay', 'Meram', 'Cumra'],
    'Gaziantep': ['Şahinbey', 'Şehitkamil', 'Oğuzeli', 'Nizip']
  })

  const addresses = ref({
    'İstanbul': {
      'Kadıköy': [
        { id: 'IST_KAD_001', street: 'Bağdat Caddesi', building: 'No:123' },
        { id: 'IST_KAD_002', street: 'Fenerbahçe Mahallesi', building: 'No:45' },
        { id: 'IST_KAD_003', street: 'Sahrayıcedit Mahallesi', building: 'No:67' }
      ],
      'Beşiktaş': [
        { id: 'IST_BES_001', street: 'Levent Mahallesi', building: 'No:89' },
        { id: 'IST_BES_002', street: 'Etiler Mahallesi', building: 'No:12' }
      ],
      'Şişli': [
        { id: 'IST_SIS_001', street: 'Teşvikiye Mahallesi', building: 'No:34' },
        { id: 'IST_SIS_002', street: 'Nişantaşı Mahallesi', building: 'No:56' }
      ]
    },
    'Ankara': {
      'Çankaya': [
        { id: 'ANK_CAN_001', street: 'Kızılay Meydanı', building: 'No:34' },
        { id: 'ANK_CAN_002', street: 'Bahçelievler Mahallesi', building: 'No:56' }
      ],
      'Keçiören': [
        { id: 'ANK_KEC_001', street: 'Keçiören Merkez', building: 'No:78' },
        { id: 'ANK_KEC_002', street: 'Sanatoryum Mahallesi', building: 'No:90' }
      ]
    },
    'İzmir': {
      'Konak': [
        { id: 'IZM_KON_001', street: 'Alsancak Mahallesi', building: 'No:12' },
        { id: 'IZM_KON_002', street: 'Konak Merkez', building: 'No:34' }
      ]
    }
  })

  // Getters
  const availableDistricts = computed(() => {
    return city.value ? districts.value[city.value] || [] : []
  })

  const availableAddresses = computed(() => {
    if (!city.value || !district.value) return []
    return addresses.value[city.value]?.[district.value] || []
  })

  const canContinue = computed(() => {
    return city.value && district.value && addressId.value && household.value.length > 0
  })

  // Actions
  const setCity = (newCity) => {
    city.value = newCity
    district.value = ''
    addressId.value = ''
  }

  const setDistrict = (newDistrict) => {
    district.value = newDistrict
    addressId.value = ''
  }

  const setAddressId = (newAddressId) => {
    addressId.value = newAddressId
  }

  const addHouseholdLine = () => {
    const newLineNumber = household.value.length + 1
    household.value.push({
      line_id: `L-${newLineNumber}`,
      expected_gb: 10,
      expected_min: 500,
      tv_hd_hours: 4
    })
  }

  const removeHouseholdLine = (index) => {
    if (household.value.length > 1) {
      household.value.splice(index, 1)
      // Reorder line IDs
      household.value.forEach((line, idx) => {
        line.line_id = `L-${idx + 1}`
      })
    }
  }

  const updateHouseholdLine = (index, field, value) => {
    if (household.value[index]) {
      household.value[index][field] = value
    }
  }

  const resetWizard = () => {
    city.value = ''
    district.value = ''
    addressId.value = ''
    household.value = [
      {
        line_id: 'L-1',
        expected_gb: 10,
        expected_min: 500,
        tv_hd_hours: 4
      }
    ]
  }

  const getFormData = () => {
    return {
      city: city.value,
      district: district.value,
      addressId: addressId.value,
      household: household.value
    }
  }

  return {
    // State
    city,
    district,
    addressId,
    household,
    cities,
    districts,
    addresses,
    
    // Getters
    availableDistricts,
    availableAddresses,
    canContinue,
    
    // Actions
    setCity,
    setDistrict,
    setAddressId,
    addHouseholdLine,
    removeHouseholdLine,
    updateHouseholdLine,
    resetWizard,
    getFormData
  }
})


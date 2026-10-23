<template>
  <div class="row q-col-gutter-xs q-mb-md">
    <!-- CARD 1: TỔNG SỐ HỘ -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-primary text-white mobile-stat-card">
        <q-card-section class="q-pa-sm row items-center justify-between no-wrap">
          <div>
            <div class="text-h5 text-weight-bolder">{{ rows.length }}</div>
            <div class="text-caption opacity-80 font-11">Tổng số</div>
          </div>
          <q-icon name="groups" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>

    <!-- CARD 2: SẮP HẾT HẠN BHYT -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-purple-7 text-white mobile-stat-card">
        <q-card-section class="q-pa-sm row items-center justify-between no-wrap">
          <div>
            <div class="text-h5 text-weight-bolder">{{ bhytSapHetHanCount }}</div>
            <div class="text-caption opacity-80 font-11">Sắp hết hạn BHYT</div>
          </div>
          <q-icon name="medical_services" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>

    <!-- CARD 3: SẮP HẾT HẠN BHXH -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-green-7 text-white mobile-stat-card">
        <q-card-section class="q-pa-sm row items-center justify-between no-wrap">
          <div>
            <div class="text-h5 text-weight-bolder">{{ bhxhSapHetHanCount }}</div>
            <div class="text-caption opacity-80 font-11">Sắp hết hạn BHXH</div>
          </div>
          <q-icon name="trending_up" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>

    <!-- CARD 4: HỒ SƠ QUÁ HẠN -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-negative text-white mobile-stat-card">
        <q-card-section class="q-pa-sm row items-center justify-between no-wrap">
          <div>
            <div class="text-h5 text-weight-bolder">{{ totalQuaHanCount }}</div>
            <div class="text-caption opacity-80 font-11">Hồ sơ quá hạn</div>
          </div>
          <q-icon name="gavel" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import moment from 'moment'

const props = defineProps({
  rows: { type: Array, default: () => [] }
})

const HOM_NAY = moment(new Date())

const bhytSapHetHanCount = computed(() => {
  return props.rows.filter(item => {
    if (!item.bhytDenNgay) return false
    const d = moment(item.bhytDenNgay, 'YYYY-MM-DD')
    return d.isSameOrAfter(HOM_NAY) && d.isBefore(moment(HOM_NAY).add(30, 'days'))
  }).length
})

const bhxhSapHetHanCount = computed(() => {
  return props.rows.filter(item => {
    if (!item.nhacDongBhxh) return false
    return moment(item.nhacDongBhxh, 'YYYY-MM-DD').isSame(HOM_NAY, 'month')
  }).length
})

const totalQuaHanCount = computed(() => {
  return props.rows.filter(item => {
    const b = item.bhytDenNgay ? moment(item.bhytDenNgay, 'YYYY-MM-DD').isBefore(HOM_NAY) : false
    const x = item.nhacDongBhxh ? moment(item.nhacDongBhxh, 'YYYY-MM-DD').isBefore(HOM_NAY, 'month') : false
    return  b || x
  }).length
})
</script>

<style scoped>
.mobile-stat-card { border-radius: 6px; }
.opacity-30 { opacity: 0.3; }
.font-11 { font-size: 11px; }
</style>

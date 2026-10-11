<template>
  <div class="row q-col-gutter-md q-mb-md">
    <div class="col-12 col-sm-4" v-for="stat in statsCards" :key="stat.title">
      <q-card flat bordered :class="`bg-${stat.color} text-white`">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h4 text-weight-bolder">{{ stat.value }}</div>
            <div class="text-subtitle2 opacity-80">{{ stat.title }}</div>
          </div>
          <q-icon :name="stat.icon" size="lg" class="opacity-40" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] }
})

const statsCards = computed(() => [
  { title: 'Tổng số hộ quản lý', value: props.rows.length, color: 'primary', icon: 'groups' },
  { title: 'Thẻ sắp hết hạn', value: props.rows.filter(r => r.tinhTrangHanThe === 'SAP_HET_HAN').length, color: 'warning', icon: 'running_with_errors' },
  { title: 'Hồ sơ đã quá hạn', value: props.rows.filter(r => r.tinhTrangHanThe === 'QUA_HAN').length, color: 'negative', icon: 'gavel' }
])
</script>

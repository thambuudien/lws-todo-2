<template>
  <!-- BỐ TRÍ LƯỚI GRID ĐỘNG PHÙ HỢP CHO CẢ MOBILE VÀ MÁY TÍNH -->
  <div class="row q-col-gutter-sm q-mb-md">
    <!-- CARD 1: TỔNG SỐ HỘ QUẢN LÝ -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-primary text-white mobile-stat-card">
        <q-card-section
          class="q-pa-sm row items-center justify-between no-wrap"
        >
          <div>
            <div class="text-h5 text-weight-bolder">{{ rows.length }}</div>
            <div class="text-caption opacity-80 font-11">Tổng số hộ</div>
          </div>
          <q-icon name="groups" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>

    <!-- CARD 2: THỐNG KÊ SẮP HẾT HẠN BHYT -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-purple-7 text-white mobile-stat-card">
        <q-card-section
          class="q-pa-sm row items-center justify-between no-wrap"
        >
          <div>
            <div class="text-h5 text-weight-bolder">
              {{ bhytSapHetHanCount }}
            </div>
            <div class="text-caption opacity-80 font-11">Sắp hết hạn BHYT</div>
          </div>
          <q-icon name="medical_services" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>

    <!-- CARD 3: THỐNG KÊ SẮP HẾT HẠN BHXH -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-green-7 text-white mobile-stat-card">
        <q-card-section
          class="q-pa-sm row items-center justify-between no-wrap"
        >
          <div>
            <div class="text-h5 text-weight-bolder">
              {{ bhxhSapHetHanCount }}
            </div>
            <div class="text-caption opacity-80 font-11">Sắp hết hạn BHXH</div>
          </div>
          <q-icon name="trending_up" size="sm" class="opacity-30" />
        </q-card-section>
      </q-card>
    </div>

    <!-- CARD 4: HỒ SƠ QUÁ HẠN ĐÃ LỌC -->
    <div class="col-6 col-sm-3">
      <q-card flat bordered class="bg-negative text-white mobile-stat-card">
        <q-card-section
          class="q-pa-sm row items-center justify-between no-wrap"
        >
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
import { computed } from "vue";
import moment from "moment";

const props = defineProps({
  rows: { type: Array, default: () => [] },
});

// Mốc thời gian mặc định của hệ thống hiện tại
const HOM_NAY = moment("2026-10-11");

/**
 * 🧩 LOGIC 1: ĐẾM SỐ KHÁCH HÀNG SẮP HẾT HẠN BHYT
 * Đã sửa: Thay .isLessThan thành .isBefore chuẩn Moment.js
 */
const bhytSapHetHanCount = computed(() => {
  return props.rows.filter((item) => {
    if (!item.bhytDenNgay) return false;
    const hanBhy = moment(item.bhytDenNgay, "YYYY-MM-DD");
    return (
      hanBhy.isSameOrAfter(HOM_NAY) &&
      hanBhy.isBefore(moment(HOM_NAY).add(30, "days"))
    );
  }).length;
});

/**
 * 🧩 LOGIC 2: ĐẾM SỐ KHÁCH HÀNG SẮP HẾT HẠN BHXH
 * Đã sửa: Thay .isLessThan thành .isBefore chuẩn Moment.js
 */
const bhxhSapHetHanCount = computed(() => {
  return props.rows.filter((item) => {
    if (!item.bhxhDenNgay) return false;
    const hanBhx = moment(item.bhxhDenNgay, "YYYY-MM-DD");
    return (
      hanBhx.isSameOrAfter(HOM_NAY) &&
      hanBhx.isBefore(moment(HOM_NAY).add(30, "days"))
    );
  }).length;
});

/**
 * 🧩 LOGIC 3: TỔNG SỐ HỒ SƠ ĐÃ QUÁ HẠN (HOẶC BHYT HOẶC BHXH)
 */
const totalQuaHanCount = computed(() => {
  return props.rows.filter((item) => {
    const treBhy = item.bhytDenNgay
      ? moment(item.bhytDenNgay, "YYYY-MM-DD").isBefore(HOM_NAY)
      : false;
    const treBhx = item.bhxhDenNgay
      ? moment(item.bhxhDenNgay, "YYYY-MM-DD").isBefore(HOM_NAY)
      : false;
    return treBhy || treBhx;
  }).length;
});
</script>

<style scoped>
.mobile-stat-card {
  border-radius: 6px;
}
.opacity-30 {
  opacity: 0.3;
}
.font-11 {
  font-size: 11px;
}
@media (max-width: 599px) {
  .text-h5 {
    font-size: 1.25rem;
    line-height: 1.5rem;
  }
}
</style>

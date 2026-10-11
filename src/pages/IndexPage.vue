<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- KHỐI 4 THẺ KPI ĐỘNG THỐNG KÊ -->
    <KPIStats :rows="rawRows || []" />

    <!-- THANH TÌM KIẾM TỰ ĐỘNG GÕ TÌM NGAY (INSTANT SEARCH) -->
    <FilterBar @search="handleLocalSearch" @addNew="openAddDialog" />

    <!-- THANH ĐIỀU HƯỚNG BỘ LỌC NGHIỆP VỤ (TỐI ƯU MOBILE CLICK) -->
    <div class="q-mb-md">
      <div class="text-caption text-grey-7 text-weight-bold q-mb-xs">
        BỘ LỌC CHIẾN DỊCH VẬN ĐỘNG
      </div>
      <div class="row q-col-gutter-xs">
        <div class="col-4">
          <q-btn
            :outline="activeFilter !== 'ALL'"
            unelevated
            no-caps
            dense
            size="sm"
            color="primary"
            class="full-width"
            label="Tất cả hộ"
            @click="activeFilter = 'ALL'"
          />
        </div>
        <div class="col-4">
          <q-btn
            :outline="activeFilter !== 'CAN_GIA_HAN'"
            unelevated
            no-caps
            dense
            size="sm"
            color="purple-7"
            class="full-width"
            label="Cần gia hạn"
            @click="activeFilter = 'CAN_GIA_HAN'"
          />
        </div>
        <div class="col-4">
          <q-btn
            :outline="activeFilter !== 'QUA_HAN_90'"
            unelevated
            no-caps
            dense
            size="sm"
            color="negative"
            class="full-width"
            label="Quá hạn > 90 ngày"
            @click="activeFilter = 'QUA_HAN_90'"
          />
        </div>
      </div>
    </div>

    <!-- THANH TRẠNG THÁI NGUỒN DỮ LIỆU -->
    <div class="row items-center justify-between q-mb-sm q-px-xs">
      <div class="text-caption text-indigo text-weight-bold row items-center">
        <q-badge
          :color="isDataFromCache ? 'orange-7' : 'positive'"
          dot
          class="q-mr-xs"
        />
        <span>{{
          isDataFromCache
            ? "Dữ liệu lưu tạm (Offline)"
            : "Dữ liệu đồng bộ trực tuyến"
        }}</span>
        <span v-if="searchText" class="text-grey-8 q-ml-xs"
          >(Khớp: {{ filteredRows.length }})</span
        >
      </div>
    </div>

    <!-- DANH SÁCH THẺ DI ĐỘNG PWA (MOBILE CARD LIST) -->
    <MainTable :rows="filteredRows" :loading="loading" @edit="openEditDialog" />

    <!-- BIỂU MẪU DIALOG 29 TRƯỜNG -->
    <FormDialog
      v-model="formDialog"
      :formData="selectedForm"
      :submitLoading="submitLoading"
      @save="handleSave"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { apolloClient } from "src/boot/apollo";
import {
  GET_DANH_SACH_BHYT,
  UPSERT_KHACH_HANG_BHYT,
  UPDATE_KHACH_HANG_BHYT,
} from "src/graphql/bhyt";
import moment from "moment";

import KPIStats from "./components/KPIStats.vue";
import FilterBar from "./components/FilterBar.vue";
import MainTable from "./components/MainTable.vue";
import FormDialog from "./components/FormDialog.vue";

const $q = useQuasar();
const HOM_NAY = moment("2026-10-11"); // Định vị thời gian thực tế hiện tại

const rawRows = ref();
const activeFilter = ref("ALL"); // Các trạng thái: ALL, CAN_GIA_HAN, QUA_HAN_90
const loading = ref(false);
const submitLoading = ref(false);
const formDialog = ref(false);
const selectedForm = ref({});
const isDataFromCache = ref(false);

const searchMode = ref("exact");
const searchText = ref("");

/**
 * ⚡ BỘ LỌC CHỒNG ĐA TẦNG CỤC BỘ (RAM FILTERING)
 */
const filteredRows = computed(() => {
  if (!rawRows.value) return;

  // Mốc 1: Tính toán ngày ranh giới quá hạn 90 ngày (11/10/2026 trừ 90 ngày = 13/07/2026)
  const mocQuaHan90Ngay = moment(HOM_NAY).subtract(90, "days");

  // Mốc 2: Ngày cuối cùng của tháng tiếp theo (Tháng 10 -> Tháng 11/2026 -> Cuối tháng là 30/11/2026)
  const mocCuoiThangTiepTheo = moment(HOM_NAY).add(1, "month").endOf("month");

  // BƯỚC 1: LỌC THEO CHIẾN DỊCH THỜI GIAN NGHIỆP VỤ BHYT
  let result = rawRows.value.filter((item) => {
    if (activeFilter.value === "ALL") return true;
    if (!item.bhytDenNgay) return false;

    const hanBhy = moment(item.bhytDenNgay, "YYYY-MM-DD");

    if (activeFilter.value === "QUA_HAN_90") {
      // Điều kiện 1: Đã hết hạn quá 90 ngày
      return hanBhy.isBefore(mocQuaHan90Ngay);
    }

    if (activeFilter.value === "CAN_GIA_HAN") {
      // Điều kiện 2: Hết hạn chưa quá 90 ngày VÀ trước ngày cuối tháng tiếp theo
      return (
        hanBhy.isSameOrAfter(mocQuaHan90Ngay) &&
        hanBhy.isSameOrBefore(mocCuoiThangTiepTheo)
      );
    }

    return true;
  });

  // BƯỚC 2: TỰ ĐỘNG LỌC CHỒNG THEO TỪ KHÓA TRÊN Ô GÕ TEXT CHỮ (TÌM KIẾM TỨC THÌ)
  const txt = searchText.value.trim().toLowerCase();
  if (txt !== "") {
    result = result.filter((item) => {
      if (searchMode.value === "exact") {
        return item.maSoBhxh === txt;
      } else {
        const nameMatch = item.hoTen
          ? item.hoTen.toLowerCase().includes(txt)
          : false;
        const phoneMatch = item.soDienThoai
          ? item.soDienThoai.includes(txt)
          : false;
        const cccdMatch = item.maSoBhxh ? item.maSoBhxh.includes(txt) : false;
        return nameMatch || phoneMatch || cccdMatch;
      }
    });
  }

  return result;
});

const handleLocalSearch = ({ mode, text }) => {
  searchMode.value = mode;
  searchText.value = text || "";
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await apolloClient.query({
      query: GET_DANH_SACH_BHYT,
      fetchPolicy: "cache-first",
    });

    // Gán dữ liệu trả về từ server/cache
    rawRows.value = res.data.traCuuBHYT || [];
    isDataFromCache.value = false; // Dữ liệu đã được cập nhật từ network thành công
  } catch (err) {
    console.error("Offline Mode Activated", err);
    isDataFromCache.value = true;

    // Fallback lấy dữ liệu từ cache cục bộ của Apollo khi mất kết nối mạng
    try {
      const cachedData = apolloClient.readQuery({ query: GET_DANH_SACH_BHYT });
      if (cachedData && cachedData.traCuuBHYT) {
        rawRows.value = cachedData.traCuuBHYT;
      }
    } catch (cacheErr) {
      console.error("Không tìm thấy dữ liệu trong cache:", cacheErr);
    }
  } finally {
    loading.value = false;
  }
};

const handleSave = async (formData) => {
  submitLoading.value = true;
  const { id, ...payload } = formData;
  try {
    if (id) {
      await apolloClient.mutate({
        mutation: UPDATE_KHACH_HANG_BHYT,
        variables: { id, ...payload },
      });
    } else {
      await apolloClient.mutate({
        mutation: UPSERT_KHACH_HANG_BHYT,
        variables: payload,
      });
    }
    $q.notify({
      color: "positive",
      message: "Đồng bộ dữ liệu thành công!",
      icon: "cloud_done",
    });
    formDialog.value = false;
    fetchData();
  } catch (err) {
    $q.notify({ color: "negative", message: err.message });
  }
  military: {
    submitLoading.value = false;
  }
};

const openAddDialog = () => {
  selectedForm.value = { id: null, maSoBhxh: "", hoTen: "" };
  formDialog.value = true;
};
const openEditDialog = (item) => {
  selectedForm.value = { ...item };
  formDialog.value = true;
};

onMounted(() => fetchData());
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>

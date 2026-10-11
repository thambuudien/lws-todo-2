<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- KHỐI 4 THẺ KPI ĐỘNG -->
    <KPIStats :rows="rawRows || []" />

    <!-- THANH TÌM KIẾM ĐA NĂNG ĐÃ NỐI BỘ LỌC CỤC BỘ -->
    <FilterBar @search="handleLocalSearch" @addNew="openAddDialog" />

    <!-- THANH TRẠNG THÁI CACHE HOẶC LỌC ĐỘNG -->
    <div class="row items-center justify-between q-mb-sm q-px-xs">
      <div class="text-caption text-indigo text-weight-bold row items-center">
        <q-badge
          :color="isDataFromCache ? 'orange-7' : 'positive'"
          dot
          class="q-mr-xs"
        />
        <span>
          {{
            isDataFromCache
              ? "Hiển thị dữ liệu lưu tạm (Offline)"
              : "Dữ liệu đã được đồng bộ mới nhất"
          }}
        </span>
        <span v-if="searchText" class="text-grey-8 q-ml-sm">
          (Tìm thấy {{ filteredRows.length }} kết quả cho "{{ searchText }}")
        </span>
      </div>
      <q-btn
        v-if="activeFilter !== 'ALL' || searchText"
        label="Xóa bộ lọc / Tìm kiếm"
        size="xs"
        color="grey-7"
        unelevated
        dense
        no-caps
        @click="clearAllFilters"
      />
    </div>

    <!-- DANH SÁCH THẺ DI ĐỘNG TỐI ƯU PWA (MOBILE CARD LIST) -->
    <MainTable :rows="filteredRows" :loading="loading" @edit="openEditDialog" />

    <!-- BIỂU MẪU DIALOG 29 TRƯỜNG NGHIỆP VỤ -->
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
const HOM_NAY = moment("2026-10-11");

// Khởi tạo mảng dữ liệu gốc
const rawRows = ref([]);
const activeFilter = ref("ALL");
const loading = ref(false);
const submitLoading = ref(false);
const formDialog = ref(false);
const selectedForm = ref({});
const isDataFromCache = ref(false);

// Khai báo biến reactive lưu từ khóa và chế độ tìm kiếm cục bộ
const searchMode = ref("exact");
const searchText = ref("");

/**
 * ⚡ BỘ LỌC ĐA NĂNG CỤC BỘ (LOCAL FILTER & SEARCH):
 * Tự động kết hợp gộp giữa Bộ lọc mốc thời gian KPI và Từ khóa tìm kiếm trên RAM điện thoại.
 */
const filteredRows = computed(() => {
  if (!rawRows.value) return [];

  // Bước 1: Lọc dữ liệu theo mốc thời gian KPI (Sắp hết hạn / Quá hạn)
  let result = rawRows.value.filter((item) => {
    if (activeFilter.value === "ALL") return true;

    if (activeFilter.value === "BHYT_SAP_HET") {
      if (!item.bhytDenNgay) return false;
      const d = moment(item.bhytDenNgay, "YYYY-MM-DD");
      return (
        d.isSameOrAfter(HOM_NAY) && d.isBefore(moment(HOM_NAY).add(30, "days"))
      );
    }
    if (activeFilter.value === "BHXH_SAP_HET") {
      if (!item.bhxhDenNgay) return false;
      const d = moment(item.bhxhDenNgay, "YYYY-MM-DD");
      return (
        d.isSameOrAfter(HOM_NAY) && d.isBefore(moment(HOM_NAY).add(30, "days"))
      );
    }
    if (activeFilter.value === "QUA_HAN") {
      const b = item.bhytDenNgay
        ? moment(item.bhytDenNgay, "YYYY-MM-DD").isBefore(HOM_NAY)
        : false;
      const x = item.bhxhDenNgay
        ? moment(item.bhxhDenNgay, "YYYY-MM-DD").isBefore(HOM_NAY)
        : false;
      return b || x;
    }
    return true;
  });

  // Bước 2: Tiếp tục lọc chồng lên (Chính xác theo CCCD hoặc Tìm kiếm phối hợp đa trường tương đối)
  const txt = searchText.value.trim().toLowerCase();
  if (txt !== "") {
    result = result.filter((item) => {
      if (searchMode.value === "exact") {
        // Khớp chính xác tuyệt đối 10 số hoặc 12 số CCCD
        return item.maSoBhxh === txt;
      } else {
        // Tìm kiếm tương đối không phân biệt hoa thường trên RAM (Họ tên, SĐT, hoặc một phần CCCD)
        const nameMatch = item.hoTen
          ? item.hoTen.toLowerCase().includes(txt)
          : false;
        const phoneMatch = item.soDienThoai
          ? item.soDienThoai.includes(txt)
          : false;
        const sdtDongTienMatch = item.sdtDongTien
          ? item.sdtDongTien.includes(txt)
          : false;
        const cccdMatch = item.maSoBhxh ? item.maSoBhxh.includes(txt) : false;

        return nameMatch || phoneMatch || sdtDongTienMatch || cccdMatch;
      }
    });
  }

  return result;
});


// Nhận dữ liệu text thay đổi liên tục từ component con gửi lên
const handleLocalSearch = ({ mode, text }) => {
  searchMode.value = mode
  searchText.value = text // Cập nhật biến reactive để kích hoạt computed lọc tức thì
}


/**
 * ⚡ HÀM TẢI DỮ LIỆU GỐC BAN ĐẦU VÀ LƯU CACHE (CHỈ GỌI KHI MỞ APP HOẶC SAU KHI LƯU)
 */
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await apolloClient.query({
      query: GET_DANH_SACH_BHYT,
      fetchPolicy: "network-only",
    });

    rawRows.value = res.data.traCuuBHYT || [];
    isDataFromCache.value = !!(res.loading && rawRows.value.length > 0);
  } catch (err) {
    console.error("Đang chạy chế độ Offline do mất kết nối mạng:", err);
    isDataFromCache.value = true;

    const cachedData = apolloClient.readQuery({ query: GET_DANH_SACH_BHYT });
    if (cachedData && cachedData.traCuuBHYT) {
      rawRows.value = cachedData.traCuuBHYT;
    }
  }
  university: {
    loading.value = false;
  }
};

// HÀM ĐỒNG BỘ DỮ LIỆU XỬ LÝ LƯU (MUTATION)
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

    // Nạp lại mảng gốc từ server sau khi có biến động dữ liệu mới
    fetchData();
  } catch (err) {
    $q.notify({
      color: "negative",
      message: err.message || "Lỗi kết nối cơ sở dữ liệu.",
    });
  } finally {
    submitLoading.value = false;
  }
};

const clearAllFilters = () => {
  activeFilter.value = "ALL";
  searchText.value = "";
};

const openAddDialog = () => {
  selectedForm.value = { id: null, maSoBhxh: "", hoTen: "" };
  formDialog.value = true;
};
const openEditDialog = (item) => {
  selectedForm.value = { ...item };
  formDialog.value = true;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- KHỐI 4 THÈ KPI ĐỘNG THỐNG KÊ CHIẾN DỊCH MẢNG GỐC -->
    <KPIStats :rows="rawRows || []" />

    <!-- THANH TÌM KIẾM HỖN HỢP TÍCH HỢP CHECKBOX LỌC KẾT HỢP -->
    <FilterBar @search="handleLocalSearch" @addNew="openAddDialog" @refresh="fetchData"/>

    <!-- THANH ĐIỀU HƯỚNG BỘ LỌC NGHIỆP VỤ (TỐI ƯU MOBILE CLICK) -->
    <div class="q-mb-md">
      <div class="text-caption text-grey-7 text-weight-bold q-mb-xs">
        BỘ LỌC CHIẾN DỊCH VẬN ĐỘNG
        <span class="text-green-9" v-if="onlyBhxhFilter">
          (ĐANG ĐIỀU HƯỚNG THEO HẠN BHXH)</span
        >
        <span class="text-purple" v-else> (ĐANG ĐIỀU HƯỚNG THEO HẠN BHYT)</span>
      </div>
      <div class="row q-col-gutter-xs">
        <div class="col-3">
          <q-btn
            :outline="activeFilter !== 'ALL'"
            unelevated
            no-caps
            dense
            size="sm"
            color="primary"
            class="full-width font-11"
            label="Tất cả hộ"
            @click="activeFilter = 'ALL'"
          />
        </div>
        <div class="col-3">
          <q-btn
            :outline="activeFilter !== 'CAN_GIA_HAN'"
            unelevated
            no-caps
            dense
            size="sm"
            color="purple-7"
            class="full-width font-11"
            label="Cần gia hạn"
            @click="activeFilter = 'CAN_GIA_HAN'"
          />
        </div>
        <div class="col-3">
          <q-btn
            :outline="activeFilter !== 'QUA_HAN_90'"
            unelevated
            no-caps
            dense
            size="sm"
            color="negative"
            class="full-width font-11"
            label="Quá hạn"
            @click="activeFilter = 'QUA_HAN_90'"
          />
        </div>
        <div class="col-3">
          <q-btn
            :outline="activeFilter !== 'CHUA_THE'"
            unelevated
            no-caps
            dense
            size="sm"
            color="indigo-7"
            class="full-width font-11"
            label="Chưa có thẻ"
            @click="activeFilter = 'CHUA_THE'"
          />
        </div>
      </div>
    </div>

    <!-- THANH TRẠNG THÁI NGUỒN DỮ LIỆU & ĐÈN BÁO CACHE -->
    <div class="row items-center justify-between q-mb-sm q-px-xs">
      <div class="text-caption text-indigo text-weight-bold row items-center">
        <q-badge
          :color="isDataFromCache ? 'orange-7' : 'positive'"
          dot
          class="q-mr-xs"
        />
        <span>{{
          isDataFromCache
            ? "Hiển thị dữ liệu lưu tạm (Offline)"
            : "Dữ liệu đồng bộ trực tuyến mới nhất"
        }}</span>
        <span class="text-grey-8 q-ml-sm">
          (Đang hiển thị: {{ filteredRows.length }} hồ sơ)
        </span>
      </div>
      <q-btn
        v-if="activeFilter !== 'ALL' || searchText || onlyBhxhFilter"
        label="Xóa toàn bộ bộ lọc"
        size="xs"
        color="grey-7"
        unelevated
        dense
        no-caps
        @click="clearAllFilters"
      />
    </div>

    <!-- DANH SÁCH THẺ DI ĐỘNG PWA (MOBILE CARD LIST) -->
    <MainTable
      :rows="filteredRows"
      :loading="loading"
      :is-bhxh-mode="onlyBhxhFilter"
      @edit="openEditDialog"
      @fetchData="fetchData"
    />

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
import MainTable from "./components/MainTable/MainTable.vue";
import FormDialog from "./components/FormDialog/FormDialog.vue";

const $q = useQuasar();

const rawRows = ref([]);
const activeFilter = ref("ALL");
const loading = ref(false);
const submitLoading = ref(false);
const formDialog = ref(false);
const selectedForm = ref({});
const isDataFromCache = ref(false);

// Biến lưu trữ trạng thái bộ lọc từ FilterBar bắn về
const searchText = ref("");
const onlyBhxhFilter = ref(false);

/**
 * ⚡ THUẬT TOÁN KẾT HỢP ĐA TẦNG CỤC BỘ TRÊN RAM (TIẾNG VIỆT KHÔNG DẤU CAMELCASE)
 */
const filteredRows = computed(() => {
  if (!rawRows.value) return [];

  // Chuẩn hóa tên biến tiếng Việt không dấu định dạng camelCase (Mốc hệ thống: 12/10/2026)
  const homNay = moment("2026-10-12");
  const thangHienTai = homNay.format("YYYY-MM");

  // Mốc ranh giới áp dụng riêng cho phân hệ BHYT và BHXH
  const mocQuaHan90Ngay = moment(homNay).subtract(90, "days");
  const mocCuoiThangTiepTheo = moment(homNay).add(1, "month").endOf("month");

  // BƯỚC 1: LỌC THEO CHIẾN DỊCH VÀ PHÂN HỆ ĐIỀU HƯỚNG CHUYÊN BIỆT
  let ketQua = rawRows.value.filter((item) => {
    // Nếu tích chọn checkbox BHXH, loại ngay những người chưa từng tham gia BHXH
    if (onlyBhxhFilter.value && item.soTienBhxh === 0) {
      return false;
    }

    if (activeFilter.value === "ALL") return true;

    if (activeFilter.value === "CHUA_THE") {
      return (
        item.tinhTrangHanThe === "CHUA_CO_THE" ||
        !item.maSoTheBhyt ||
        item.maSoTheBhyt.trim() === ""
      );
    }

    // 🔥 PHÂN TÁCH LOGIC BỘ LỌC THỜI GIAN THEO ĐÚNG HÀM CHECKBOX KHÔNG DẤU CAMELCASE
    if (onlyBhxhFilter.value) {
      // 📊 PHÂN HỆ BHXH TỰ NGUYỆN: Kiểm tra và tính toán quá hạn theo Tháng trước
      const ngayKiemTraStr =
        item.nhacDongBhxh && item.nhacDongBhxh.trim() !== ""
          ? item.nhacDongBhxh
          : item.bhxhDenNgay;
      if (!ngayKiemTraStr) return false;

      const mocThangBhxh = moment(ngayKiemTraStr, "YYYY-MM-DD").format(
        "YYYY-MM"
      );

      if (activeFilter.value === "QUA_HAN_90") {
        // QUY TẮC BHXH: Quá hạn đóng nghĩa là mốc tháng nằm ở Tháng trước
        return mocThangBhxh < thangHienTai;
      }

      if (activeFilter.value === "CAN_GIA_HAN") {
        // Cần gia hạn BHXH: Kỳ nộp tiền nằm ở tháng hiện tại hoặc tháng tiếp theo
        const mocCuoiBhxh = moment(ngayKiemTraStr, "YYYY-MM-DD").endOf("month");
        return (
          mocCuoiBhxh.isSameOrAfter(homNay) &&
          mocCuoiBhxh.isSameOrBefore(mocCuoiThangTiepTheo)
        );
      }
    } else {
      // 🏥 PHÂN HỆ BHYT: Kiểm tra chính xác theo từng Ngày hết hạn thẻ gốc
      if (!item.bhytDenNgay) return false;
      const hanTheBhyt = moment(item.bhytDenNgay, "YYYY-MM-DD");

      if (activeFilter.value === "QUA_HAN_90") {
        // QUY TẮC BHYT: Áp dụng mốc tính toán trễ hạn chính xác quá 90 ngày
        return hanTheBhyt.isBefore(mocQuaHan90Ngay);
      }

      if (activeFilter.value === "CAN_GIA_HAN") {
        // Cần gia hạn BHYT: Hết hạn chưa quá 90 ngày và trước cuối tháng sau
        return (
          hanTheBhyt.isSameOrAfter(mocQuaHan90Ngay) &&
          hanTheBhyt.isSameOrBefore(mocCuoiThangTiepTheo)
        );
      }
    }

    return true;
  });

  // BƯỚC 2: LỌC TỰ ĐỘNG TÌM KIẾM HỖN HỢP TRÊN BỘ NHỚ RAM
  const tuKhoa = searchText.value.trim().toLowerCase();
  if (tuKhoa !== "") {
    ketQua = ketQua.filter((item) => {
      const trungTen = item.hoTen
        ? item.hoTen.toLowerCase().includes(tuKhoa)
        : false;
      const trungSdt = item.soDienThoai
        ? item.soDienThoai.includes(tuKhoa)
        : false;
      const trungCccd = item.maSoBhxh ? item.maSoBhxh.includes(tuKhoa) : false;
      return trungTen || trungSdt || trungCccd;
    });
  }

  return ketQua;
});

// Nhận gộp gói dữ liệu filter truyền từ FilterBar
const handleLocalSearch = (payload) => {
  if (payload && typeof payload === "object") {
    searchText.value = payload.text || "";
    onlyBhxhFilter.value = payload.onlyBhxh ?? false; // Đồng bộ cập nhật trạng thái true/false của Checkbox
  } else {
    // Dự phòng nếu hệ thống truyền text đơn lẻ
    searchText.value = payload || "";
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await apolloClient.query({
      query: GET_DANH_SACH_BHYT,
      fetchPolicy: "network-only", // Dùng network-only để ép gọi server lấy mới nhất khi có mạng
    });

    rawRows.value = res.data.traCuuBHYT || [];
    isDataFromCache.value = false;

    // LƯU DỰ PHÒNG: Ghi vào localStorage để phòng hờ F5 hoặc mất mạng lần sau
    localStorage.setItem("cached_bhyt_list", JSON.stringify(rawRows.value));
  } catch (err) {
    console.warn("Mất kết nối mạng, đang chuyển sang dữ liệu dự phòng...", err);
    isDataFromCache.value = true;

    // Ưu tiên 1: Đọc thử từ Apollo InMemoryCache trước
    try {
      const cachedData = apolloClient.readQuery({ query: GET_DANH_SACH_BHYT });
      if (cachedData && cachedData.traCuuBHYT) {
        rawRows.value = cachedData.traCuuBHYT;
        return;
      }
    } catch (e) {
      // Bỏ qua nếu Apollo cache trống
    }

    // Ưu tiên 2: Fallback tuyệt đối bằng localStorage (An toàn 100% khi F5 mất mạng)
    const localBackup = localStorage.getItem("cached_bhyt_list");
    if (localBackup) {
      try {
        rawRows.value = JSON.parse(localBackup);
        console.log("Đã khôi phục dữ liệu từ localStorage dự phòng.");
      } catch (parseErr) {
        console.error("Lỗi giải mã dữ liệu dự phòng:", parseErr);
        rawRows.value = [];
      }
    } else {
      rawRows.value = [];
    }
  } finally {
    loading.value = false;
  }
};

const handleSave = async (formData) => {
  submitLoading.value = true;
  try {
    if (formData.id) {
      await apolloClient.mutate({
        mutation: UPDATE_KHACH_HANG_BHYT,
        variables: { id: formData.id, ...formData },
      });
    } else {
      await apolloClient.mutate({
        mutation: UPSERT_KHACH_HANG_BHYT,
        variables: formData,
      });
    }
    $q.notify({
      color: "positive",
      message: "Đồng bộ cơ sở dữ liệu thành công!",
      icon: "cloud_done",
    });
    formDialog.value = false;
    fetchData();
  } catch (err) {
    $q.notify({
      color: "negative",
      message: err.message || "Lỗi lưu dữ liệu.",
    });
  } finally {
    submitLoading.value = false;
  }
};

const clearAllFilters = () => {
  activeFilter.value = "ALL";
  searchText.value = "";
  onlyBhxhFilter.value = false;
  $q.notify({
    message: "Đã thiết lập lại toàn bộ bộ lọc mặc định.",
    color: "grey-8",
    timeout: 1000,
  });
};

const openAddDialog = () => {
  selectedForm.value = {
    id: null,
    maSoBhxh: "",
    hoTen: "",
    gioiTinh: null,
    tinhTrangHanThe: "CON_HAN",
  };
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
.font-11 {
  font-size: 11px;
}
</style>

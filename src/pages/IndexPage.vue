<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- KHỐI 4 THÈ KPI ĐỘNG THỐNG KÊ CHIẾN DỊCH MẢNG GỐC -->
    <KPIStats :rows="rawRows || []" />

    <!-- THANH TÌM KIẾM HỖN HỢP TÍCH HỢP CHECKBOX LỌC KẾT HỢP -->
    <FilterBar
      @search="handleLocalSearch"
      @addNew="openAddDialog"
      @refresh="fetchData"
      @syncData="syncDataSSM"
    />

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
            :label="onlyBhxhFilter ? 'Chưa cập nhật' : 'Chưa có thẻ'"
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
          (Đang hiển thị: {{ paginatedRows.length }} / {{ filteredRows.length }}
          hồ sơ)
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
      :rows="paginatedRows"
      :loading="loading"
      :is-bhxh-mode="onlyBhxhFilter"
      :total-rows="filteredRows.length"
      :loading-more="loadingMore"
      @edit="openEditDialog"
      @fetchData="fetchData"
      @loadMore="handleLoadMore"
      @loaiBoThanhVien="loaiBoThanhVien"
      @searchByMaHoGiaDinh="handleSearchByMaHoGiaDinh"
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
import { ref, computed, onMounted, watch } from "vue";
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

import { useExternalLinks } from "../composables/useLinking.js";
const { openLinkSsm } = useExternalLinks();

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

// Pagination Refs
const paginatedRows = ref([]);
const lastLoadedIndex = ref(0);
const pageSize = 50;
const loadingMore = ref(false);

const loaiBoThanhVien = (id) => {
  const index = paginatedRows.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    paginatedRows.value.splice(index, 1);
  }
};

const handleSearchByMaHoGiaDinh = (maHoGiaDinh) => {
  searchText.value = maHoGiaDinh;
};

/**
 * ⚡ THUẬT TOÁN KẾT HỢP ĐA TẦNG CỤC BỘ TRÊN RAM (TIẾNG VIỆT KHÔNG DẤU CAMELCASE)
 */
const filteredRows = computed(() => {
  if (!rawRows.value || rawRows.value.length === 0) return [];

  const homNay = moment();
  const thangHienTai = homNay.format("YYYY-MM"); // Định dạng "YYYY-MM"
  const mocQuaHan90Ngay = moment(homNay).subtract(90, "days");
  const mocCuoiThangTiepTheo = moment(homNay).add(1, "month").endOf("month");

  const isBhxh = onlyBhxhFilter.value;
  const filterType = activeFilter.value;
  const tuKhoa = searchText.value.trim().toLowerCase();

  // BƯỚC 1: LỌC THEO CHIẾN DỊCH VÀ PHÂN HỆ ĐIỀU HƯỚNG
  let ketQua = rawRows.value.filter((item) => {
    // Nếu tích chọn BHXH mà không có tiền đóng -> Loại luôn
    if (isBhxh && item.soTienBhxh === 0) return false;

    if (filterType === "ALL") return true;

    if (filterType === "CHUA_THE") {
      if (isBhxh) {
        return !item.nhacDongBhxh || item.nhacDongBhxh.trim() === "";
      }
      return !item.maSoTheBhyt || item.maSoTheBhyt.trim() === "";
    }

    if (isBhxh) {
      // --- PHÂN HỆ BHXH TỰ NGUYỆN (Ưu tiên ngày đóng tiền + phương thức đóng số) ---
      let ngayHetHanBhxh = null;
      const ngayDongBHXH = item.ngayBienLaiBhxh;

      // Trích xuất lấy ra số từ chuỗi phương thức đóng (ví dụ: "3 tháng" -> 3)
      let phuongThuc = 1;
      if (item.phuongThucDong !== undefined && item.phuongThucDong !== null) {
        const match = String(item.phuongThucDong).match(/\d+/);
        if (match) {
          phuongThuc = parseInt(match[0], 10);
        }
      }

      const hasValidPhuongThuc = [1, 3, 6, 12].includes(phuongThuc);

      if (ngayDongBHXH && hasValidPhuongThuc) {
        const thangDongBhxh = ngayDongBHXH.substring(0, 7);

        // Nếu đã đóng trong tháng hiện tại -> Đã hoàn tất, loại ra luôn
        if (thangDongBhxh === thangHienTai) {
          return false;
        }

        // Tính mốc hết hạn dựa trên ngày biên lai + số tháng phương thức đóng
        ngayHetHanBhxh = moment(ngayDongBHXH, "YYYY-MM-DD").add(
          phuongThuc,
          "months"
        );
      } else {
        // Fallback: Nếu không có ngày biên lai hoặc phương thức đóng không hợp lệ thì dùng mốc nhắc đóng
        if (!item.nhacDongBhxh) return false;
        const mocThangBhxh = item.nhacDongBhxh.substring(0, 7);
        ngayHetHanBhxh = moment(mocThangBhxh + "-01", "YYYY-MM-DD");
      }

      if (!ngayHetHanBhxh || !ngayHetHanBhxh.isValid()) return false;

      const thoiDiemHienTai = moment(thangHienTai + "-01", "YYYY-MM-DD");

      if (filterType === "QUA_HAN_90") {
        return thoiDiemHienTai.isAfter(ngayHetHanBhxh, "month");
      }
      if (filterType === "CAN_GIA_HAN") {
        return (
          thoiDiemHienTai.isSame(ngayHetHanBhxh, "month") ||
          (thoiDiemHienTai.isAfter(ngayHetHanBhxh, "month") &&
            thoiDiemHienTai.isSameOrBefore(
              moment(ngayHetHanBhxh).add(1, "month"),
              "month"
            ))
        );
      }
    } else {
      // --- PHÂN HỆ BHYT (Ưu tiên bhytDenNgay, nếu không có lấy ngày nộp tiền + 12 tháng) ---
      let hanTheBhyt = null;

      if (item.bhytDenNgay) {
        hanTheBhyt = moment(item.bhytDenNgay, "YYYY-MM-DD");
      } else if (item.ngayBienLaiBhyt) {
        const thangDongBhyt = item.ngayBienLaiBhyt.substring(0, 7);
        if (thangDongBhyt === thangHienTai) {
          return false;
        }
        hanTheBhyt = moment(item.ngayBienLaiBhyt, "YYYY-MM-DD").add(
          12,
          "months"
        );
      }

      if (!hanTheBhyt || !hanTheBhyt.isValid()) return false;

      if (filterType === "QUA_HAN_90") {
        return hanTheBhyt.isBefore(mocQuaHan90Ngay);
      }
      if (filterType === "CAN_GIA_HAN") {
        return (
          hanTheBhyt.isSameOrAfter(mocQuaHan90Ngay) &&
          hanTheBhyt.isBefore(mocCuoiThangTiepTheo)
        );
      }
    }

    return true;
  });

  // BƯỚC 2: LỌC TÌM KIẾM HỖN HỢP TRÊN BỘ NHỚ RAM
  if (tuKhoa !== "") {
    ketQua = ketQua.filter((item) => {
      const trungTen = (item.hoTen + " " + (item.ngaySinh || ""))
        .toLowerCase()
        .includes(tuKhoa);
      const trungSdt = item.soDienThoai && item.soDienThoai.includes(tuKhoa);
      const trungCccd = item.maSoBhxh && item.maSoBhxh.includes(tuKhoa);
      const trungMaHoGiaDinh =
        item.maHoGiaDinh && item.maHoGiaDinh.includes(tuKhoa);
      const trungMaToKhaiRieng =
        item.maToKhaiRieng && item.maToKhaiRieng.includes(tuKhoa);
      const trungGhiChu =
        item.ghiChu && item.ghiChu.toLowerCase().includes(tuKhoa);

      return (
        trungTen ||
        trungSdt ||
        trungCccd ||
        trungMaHoGiaDinh ||
        trungMaToKhaiRieng ||
        trungGhiChu
      );
    });
  }

  return ketQua;
});

// Reset pagination when filters change
watch(filteredRows, () => {
  paginatedRows.value = filteredRows.value.slice(0, pageSize);
  lastLoadedIndex.value = pageSize;
});

const handleLoadMore = () => {
  loadingMore.value = true;
  setTimeout(() => {
    const nextItems = filteredRows.value.slice(
      lastLoadedIndex.value,
      lastLoadedIndex.value + pageSize
    );
    paginatedRows.value.push(...nextItems);
    lastLoadedIndex.value += pageSize;
    loadingMore.value = false;
  }, 500); // Simulate network delay
};

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

const syncDataSSM = async () => {
  // Kiểm tra nếu danh sách khách hàng rỗng hoặc không tồn tại
  if (!paginatedRows.value || paginatedRows.value.length === 0) {
    $q.notify({
      color: "negative",
      message: "Không có dữ liệu khách hàng để đồng bộ!",
    });
    return;
  }

  // Duyệt qua từng khách hàng trong danh sách
  for (let i = 0; i < paginatedRows.value.length; i++) {
    const customer = paginatedRows.value[i];

    // Gọi hàm mở link tương ứng cho từng khách hàng
    openLinkSsm(customer, onlyBhxhFilter.value);

    // Dừng lại 1 khoảng thời gian (ví dụ: 1.5 giây = 1500ms) trước khi mở tab tiếp theo
    // Thời gian này giúp trình duyệt không chặn pop-up
    if (i < paginatedRows.value.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 6060));
    }
  }

  // Sau khi duyệt hết tất cả, có thể gọi lại fetchData hoặc thông báo hoàn tất nếu muốn
  setTimeout(() => {
    fetchData();
  }, 6060);
  $q.notify({
    color: "positive",
    message: "Đã đồng bộ tất cả khách hàng thành công!",
  });
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

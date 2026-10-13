<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 85vw; max-width: 90vw">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6 text-weight-bold row items-center">
          <q-icon
            :name="localForm.id ? 'edit_note' : 'person_add'"
            size="28px"
            class="q-mr-xs"
          />
          {{
            localForm.id
              ? "CẬP NHẬT HỒ SƠ THỦ CÔNG"
              : "THÊM MỚI HỒ SƠ NGHIỆP VỤ"
          }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <!-- GẮN BỘ FORM VALIDATOR CỦA QUASAR -->
      <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
        <q-form ref="khachHangForm" class="q-gutter-y-md">
          <FormHanhChinh v-model="localForm" />

          <FormBHYT v-model="localForm" />

          <FormBHXH v-model="localForm" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn label="Hủy bỏ" color="grey-7" flat @click="close" />
        <q-btn
          label="Lưu & Đồng bộ dữ liệu"
          color="primary"
          icon="sync"
          :loading="submitLoading"
          @click="validateVaLuu"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";

// Nạp các biểu mẫu con đã chia nhỏ nhiều từ chuẩn ESLint
import FormHanhChinh from "./FormHanhChinh.vue";
import FormBHYT from "./FormBHYT.vue";
import FormBHXH from "./FormBHXH.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  formData: { type: Object, default: () => ({}) },
  submitLoading: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "save"]);

const $q = useQuasar();
const isOpen = ref(props.modelValue);
const khachHangForm = ref(null);

const createEmptyForm = () => ({
  id: null,
  maSoBhxh: "",
  hoTen: "",
  gioiTinh: null,
  soDienThoai: "",
  ngaySinh: "",
  bhytTuNgay: "",
  bhytDenNgay: "",
  soTienBhyt: 0,
  bhxhTuNgay: "",
  bhxhDenNgay: "",
  nhacDongBhxh: "",
  soTienBhxh: 0,
  soThangBhxh: 0,
  mucThuNhapBhxh: 0,
  ngayBienLaiBhyt: "",
  ngayBienLaiBhxh: "",
  maSoTheBhyt: "",
  ngay5NamLienTuc: "",
  noiKcbBanDau: "",
  donViDong: "",
  theoDoiCoQuanBhxh: "CHUA_NOP",
  maHoGiaDinh: "",
  maToKhaiRieng: "",
  ghiChu: "",
  sdtDongTien: "",
  sdtNhacHan: "",
  tinhTrangHanThe: "CON_HAN",
});

const localForm = ref(createEmptyForm());

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
  }
);
watch(
  () => isOpen.value,
  (val) => {
    emit("update:modelValue", val);
  }
);

// Khử lỗi giá trị 0000-00-00 khi nạp hồ sơ từ database lên biểu mẫu
watch(
  () => props.formData,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      const duLieuSach = { ...createEmptyForm(), ...val };
      const cacTruongNgay = [
        "ngaySinh",
        "bhytTuNgay",
        "bhytDenNgay",
        "ngayBienLaiBhyt",
        "ngay5NamLienTuc",
        "bhxhTuNgay",
        "bhxhDenNgay",
        "nhacDongBhxh",
        "ngayBienLaiBhxh",
      ];

      cacTruongNgay.forEach((truong) => {
        if (duLieuSach[truong] === "0000-00-00") {
          duLieuSach[truong] = "";
        }
      });
      localForm.value = duLieuSach;
    } else {
      localForm.value = createEmptyForm();
    }
  },
  { deep: true, immediate: true }
);

const close = () => {
  isOpen.value = false;
};

/**
 * ⚡ KÍCH HOẠT VALIDATOR KIỂM TRA ĐỦ ĐIỀU KIỆN 3 TRƯỜNG TRƯỚC KHI LƯU
 */
const validateVaLuu = async () => {
  // Trích xuất hàm check của q-form
  const formChuanXac = await khachHangForm.value.validate();

  if (!formChuanXac) {
    $q.notify({
      color: "negative",
      icon: "warning",
      message:
        "Vui lòng kiểm tra và điền đầy đủ 3 thông tin bắt buộc: CCCD 12 số, Họ tên và Ngày sinh.",
    });
    return;
  }

  // Khử định dạng lỗi ngày tháng trống về chuỗi rỗng sạch tránh lỗi 0000-00-00 trong MySQL
  const payloadGuiDi = { ...localForm.value };
  const cacTruongNgay = [
    "ngaySinh",
    "bhytTuNgay",
    "bhytDenNgay",
    "ngayBienLaiBhyt",
    "ngay5NamLienTuc",
    "bhxhTuNgay",
    "bhxhDenNgay",
    "nhacDongBhxh",
    "ngayBienLaiBhxh",
  ];

  cacTruongNgay.forEach((truong) => {
    if (!payloadGuiDi[truong] || payloadGuiDi[truong].trim() === "") {
      payloadGuiDi[truong] = "";
    }
  });

  emit("save", payloadGuiDi);
};
</script>

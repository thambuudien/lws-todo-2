<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 85vw; max-width: 90vw">
      <!-- TIÊU ĐỀ DIALOG ĐA NĂNG -->
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
              : "THÊM MỚI / ĐỒNG BỘ ĐỘNG (UPSERT)"
          }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <!-- KHU VỰC NHẬP LIỆU CHIA KHỐI NGHIỆP VỤ CHUYÊN SÂU -->
      <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
        <q-form class="row q-col-gutter-sm">
          <!-- KHỐI 1: THÔNG TIN ĐỊNH DANH HÀNH CHÍNH CƠ BẢN -->
          <div
            class="col-12 text-subtitle2 text-primary text-weight-bold row items-center"
          >
            <q-icon name="badge" class="q-mr-xs" /> ĐỊNH DANH HÀNH CHÍNH CƠ BẢN
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.maSoBhxh"
              label="Số định danh / CCCD 12 số *"
              mask="############"
              :disable="!!localForm.id"
              hint="Mã số BHXH duy nhất từ 1/9/2026"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.hoTen"
              label="Họ và tên khách hàng *"
              autocapitalize="characters"
            />
          </div>
          <div class="col-12 col-sm-4">
            <!-- GIỚI TÍNH CHUẨN BOOLEAN (TRUE: NAM / FALSE: NỮ) -->
            <q-select
              filled
              dense
              emit-value
              map-options
              v-model="localForm.gioiTinh"
              :options="[
                { label: 'Nam', value: true },
                { label: 'Nữ', value: false },
              ]"
              label="Giới tính"
            >
              <template v-slot:prepend>
                <q-icon
                  :name="
                    localForm.gioiTinh === true
                      ? 'male'
                      : localForm.gioiTinh === false
                      ? 'female'
                      : 'wc'
                  "
                />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.ngaySinh"
              label="Ngày sinh (YYYY-MM-DD)"
              mask="####-##-##"
              placeholder="Ví dụ: 1990-05-20"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.soDienThoai"
              label="Số điện thoại liên hệ chính"
              mask="##########"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.maHoGiaDinh"
              label="Mã hộ gia đình"
              placeholder="Ví dụ: HGĐ0012345"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              filled
              dense
              v-model="localForm.maToKhaiRieng"
              label="Mã tờ khai riêng (Nếu có)"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              filled
              dense
              v-model="localForm.donViDong"
              label="Đơn vị đóng hành chính"
              placeholder="Ví dụ: Cá nhân tự nguyện"
            />
          </div>

          <!-- KHỐI 2: PHÂN HỆ NGHIỆP VỤ BẢO HIỂM Y TẾ -->
          <div
            class="col-12 text-subtitle2 text-purple text-weight-bold q-mt-md row items-center"
          >
            <q-icon name="medical_services" class="q-mr-xs" /> 🏥 NGHIỆP VỤ BẢO
            HIỂM Y TẾ HỘ GIA ĐÌNH
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.maSoTheBhyt"
              label="Mã số thẻ BHYT (15 ký tự)"
              hint="Bỏ trống nếu tham gia lần đầu chưa có thẻ"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.bhytTuNgay"
              label="Hạn thẻ từ ngày (YYYY-MM-DD)"
              mask="####-##-##"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.bhytDenNgay"
              label="Hạn thẻ đến ngày (YYYY-MM-DD)"
              mask="####-##-##"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              type="number"
              v-model.number="localForm.soTienBhyt"
              label="Số tiền đóng BHYT (VNĐ)"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.noiKcbBanDau"
              label="Mã nơi ĐK KCB ban đầu"
              placeholder="Ví dụ: 01-014"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.ngay5NamLienTuc"
              label="Ngày đủ 5 năm liên tục"
              mask="####-##-##"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              filled
              dense
              v-model="localForm.ngayBienLaiBhyt"
              label="Ngày lập biên lai thu tiền BHYT"
              mask="####-##-##"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              filled
              dense
              emit-value
              map-options
              v-model="localForm.theoDoiCoQuanBhxh"
              :options="[
                { label: 'Chưa nộp cơ quan BHXH', value: 'CHUA_NOP' },
                {
                  label: 'Đã nộp - Chờ phát sinh hạn thẻ mới',
                  value: 'DA_NOP_CHO_PHAT_SINH',
                },
              ]"
              label="Theo dõi tiến độ tại cơ quan BHXH *"
            />
          </div>

          <!-- KHỐI 3: PHÂN HỆ NGHIỆP VỤ BHXH TỰ NGUYỆN -->
          <div
            class="col-12 text-subtitle2 text-green-9 text-weight-bold q-mt-md row items-center"
          >
            <q-icon name="trending_up" class="q-mr-xs" /> 📈 NGHIỆP VỤ BẢO HIỂM
            XÃ HỘI TỰ NGUYỆN
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.bhxhTuNgay"
              label="BHXH đóng từ ngày"
              mask="####-##-##"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.bhxhDenNgay"
              label="BHXH đóng đến ngày"
              mask="####-##-##"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              type="number"
              v-model.number="localForm.soThangBhxh"
              label="Số tháng đóng (Phương thức)"
              hint="Ví dụ: 3, 6, 12 tháng"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              type="number"
              v-model.number="localForm.mucThuNhapBhxh"
              label="Mức thu nhập lựa chọn đóng (VNĐ)"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              type="number"
              v-model.number="localForm.soTienBhxh"
              label="Số tiền thực nộp BHXH (VNĐ)"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.nhacDongBhxh"
              label="Ngày hẹn nhắn nhắc đóng BHXH"
              mask="####-##-##"
            />
          </div>
          <div class="col-12">
            <q-input
              filled
              dense
              v-model="localForm.ngayBienLaiBhxh"
              label="Ngày lập biên lai thu tiền BHXH"
              mask="####-##-##"
            />
          </div>

          <!-- KHỐI 4: THÔNG TIN ĐIỀU PHỐI ĐÒN BẨY & GHI CHÚ -->
          <div
            class="col-12 text-subtitle2 text-orange-9 text-weight-bold q-mt-md row items-center"
          >
            <q-icon name="hub" class="q-mr-xs" /> 📍 THÔNG TIN ĐIỀU PHỐI TIN
            NHẮN & KIỂM SOÁT
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.sdtDongTien"
              label="SĐT người trực tiếp nộp tiền"
              mask="##########"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.sdtNhacHan"
              label="SĐT nhận tin nhắn nhắc hạn"
              mask="##########"
            />
          </div>
          <div class="col-12 col-sm-4">
            <!-- BỘ CHỌN HẠN THẺ TÍCH HỢP TRẠNG THÁI CHO NGƯỜI CHƯA CÓ THẺ -->
            <q-select
              filled
              dense
              emit-value
              map-options
              v-model="localForm.tinhTrangHanThe"
              :options="[
                { label: 'Còn hạn sử dụng', value: 'CON_HAN' },
                { label: 'Sắp hết hạn', value: 'SAP_HET_HAN' },
                { label: 'Quá hạn thẻ', value: 'QUA_HAN' },
                {
                  label: 'Chưa có thẻ (Mới tham gia) 📍',
                  value: 'CHUA_CO_THE',
                },
              ]"
              label="Tình trạng hạn thẻ *"
            />
          </div>
          <div class="col-12">
            <q-input
              filled
              dense
              type="textarea"
              v-model="localForm.ghiChu"
              label="Ghi chú chi tiết đợt vận động tái tục..."
              rows="2"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- KHU VỰC NÚT BẤM HÀNH ĐỘNG HỢP NHẤT -->
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn label="Hủy bỏ" color="grey-7" flat @click="close" />
        <q-btn
          label="Lưu & Đồng bộ dữ liệu"
          color="primary"
          icon="sync"
          :loading="submitLoading"
          @click="save"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  formData: { type: Object, default: () => ({}) },
  submitLoading: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "save"]);

const isOpen = ref(props.modelValue);

// Định hình cấu trúc khởi tạo sạch, tường minh đầy đủ toàn bộ 29 trường thuộc tính
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

// Đồng bộ sâu dữ liệu khi mở/đổi bản ghi từ lớp cha điều phối truyền vào
watch(
  () => props.formData,
  (val) => {
    localForm.value =
      val && Object.keys(val).length > 0
        ? { ...createEmptyForm(), ...val }
        : createEmptyForm();
  },
  { deep: true, immediate: true }
);

const close = () => {
  isOpen.value = false;
};
const save = () => {
  emit("save", localForm.value);
};
</script>

<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 85vw; max-width: 90vw;">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">{{ localForm.id ? 'SỬA THỦ CÔNG HỒ SƠ' : 'THÊM MỚI / ĐỒNG BỘ ĐỘNG (UPSERT)' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
        <q-form class="row q-col-gutter-sm">
          <!-- Thông tin cơ bản -->
          <div class="col-12 col-sm-4">
            <q-input filled dense v-model="localForm.maSoBhxh" label="Số định danh / CCCD 12 số *" mask="############" :disable="!!localForm.id" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input filled dense v-model="localForm.hoTen" label="Họ và tên khách hàng *" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input filled dense v-model="localForm.soDienThoai" label="Số điện thoại chính" mask="##########" />
          </div>

          <div class="col-12 col-sm-4">
            <q-input filled dense v-model="localForm.maHoGiaDinh" label="Mã hộ gia đình" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input filled dense v-model="localForm.maToKhaiRieng" label="Mã tờ khai riêng" />
          </div>

          <!-- TRƯỜNG NGÀY SINH BỔ SUNG: Tích hợp Popup q-date chọn lịch nhanh -->
          <div class="col-12 col-sm-4">
            <q-input
              filled
              dense
              v-model="localForm.ngaySinh"
              label="Ngày sinh (YYYY-MM-DD)"
              mask="####-##-##"
              hint="Ví dụ: 1995-08-25"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="localForm.ngaySinh" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Chọn" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Phân hệ BHYT -->
          <div class="col-12 text-subtitle2 text-purple text-weight-bold q-mt-md">🏥 Nghiệp vụ thẻ Bảo hiểm y tế</div>
          <div class="col-12 col-sm-4"><q-input filled dense v-model="localForm.maSoTheBhyt" label="Mã số thẻ BHYT" /></div>
          <div class="col-12 col-sm-4"><q-input filled dense v-model="localForm.bhytDenNgay" label="Hạn thẻ đến ngày (YYYY-MM-DD)" mask="####-##-##" /></div>
          <div class="col-12 col-sm-4"><q-input filled dense type="number" v-model.number="localForm.soTienBhyt" label="Số tiền đóng BHYT" /></div>

          <!-- Phân hệ BHXH -->
          <div class="col-12 text-subtitle2 text-green-9 text-weight-bold q-mt-md">📈 Nghiệp vụ Bảo hiểm xã hội tự nguyện</div>
          <div class="col-12 col-sm-4"><q-input filled dense v-model="localForm.bhxhDenNgay" label="BHXH đóng đến ngày (YYYY-MM-DD)" mask="####-##-##" /></div>
          <div class="col-12 col-sm-4"><q-input filled dense type="number" v-model.number="localForm.soThangBhxh" label="Số tháng tham gia" /></div>
          <div class="col-12 col-sm-4"><q-input filled dense type="number" v-model.number="localForm.soTienBhxh" label="Số tiền nộp BHXH" /></div>

          <!-- Kiểm soát -->
          <div class="col-12 text-subtitle2 text-orange-9 text-weight-bold q-mt-md">📍 Ghi chú kiểm soát</div>
          <div class="col-12"><q-input filled dense type="textarea" v-model="localForm.ghiChu" label="Ghi chú chi tiết đợt vận động..." rows="2" /></div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn label="Hủy bỏ" color="grey-7" flat @click="close" />
        <q-btn label="Lưu thay đổi" color="primary" icon="sync" :loading="submitLoading" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  formData: { type: Object, default: () => ({}) },
  submitLoading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = ref(props.modelValue)

// localForm khởi tạo cấu trúc nhận diện thêm trường ngaySinh mặc định
const localForm = ref({
  id: null,
  maSoBhxh: '',
  hoTen: '',
  soDienThoai: '',
  maHoGiaDinh: '',
  maToKhaiRieng: '',
  ngaySinh: '', // Đăng ký thuộc tính phản xạ đồng bộ
  maSoTheBhyt: '',
  bhytDenNgay: '',
  soTienBhyt: 0,
  bhxhDenNgay: '',
  soThangBhxh: 0,
  soTienBhxh: 0,
  ghiChu: '',
  ...props.formData
})

watch(() => props.modelValue, (val) => { isOpen.value = val })
watch(() => isOpen.value, (val) => { emit('update:modelValue', val) })
watch(() => props.formData, (val) => { localForm.value = { ...val } }, { deep: true })

const close = () => { isOpen.value = false }
const save = () => { emit('save', localForm.value) }
</script>

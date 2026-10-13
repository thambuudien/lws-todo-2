<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 text-subtitle2 text-purple text-weight-bold q-mt-md row items-center">
      <q-icon name="medical_services" class="q-mr-xs" /> 🏥 NGHIỆP VỤ BẢO HIỂM Y TẾ HỘ GIA ĐÌNH
    </div>
    <div class="col-12 col-sm-4">
      <q-input filled dense v-model="model.maSoTheBhyt" label="Mã số thẻ BHYT (15 ký tự)" hint="Bỏ trống nếu tham gia lần đầu chưa có thẻ" />
    </div>
    <div class="col-12 col-sm-4">
      <q-input filled dense v-model="model.bhytTuNgay" label="Hạn thẻ từ ngày (YYYY-MM-DD)" mask="####-##-##" />
    </div>
    <div class="col-12 col-sm-4">
      <q-input filled dense v-model="model.bhytDenNgay" label="Hạn thẻ đến ngày (YYYY-MM-DD)" mask="####-##-##" />
    </div>
    <div class="col-12 col-sm-4">
      <q-input filled dense type="number" v-model.number="model.soTienBhyt" label="Số tiền đóng BHYT (VNĐ)" />
    </div>
    <div class="col-12 col-sm-4">
      <q-input filled dense v-model="model.noiKcbBanDau" label="Mã nơi ĐK KCB ban đầu" placeholder="Ví dụ: 01-014" />
    </div>
    <div class="col-12 col-sm-4">
      <q-input filled dense v-model="model.ngay5NamLienTuc" label="Ngày đủ 5 năm liên tục" mask="####-##-##" />
    </div>
    <div class="col-12 col-sm-6">
      <q-input filled dense v-model="model.ngayBienLaiBhyt" label="Ngày lập biên lai thu tiền BHYT" mask="####-##-##" />
    </div>
    <div class="col-12 col-sm-6">
      <q-select
        filled dense emit-value map-options v-model="model.theoDoiCoQuanBhxh"
        :options="[{label:'Chưa nộp cơ quan BHXH',value:'CHUA_NOP'},{label:'Đã nộp - Chờ phát sinh hạn thẻ mới',value:'DA_NOP_CHO_PHAT_SINH'}]"
        label="Theo dõi tiến độ tại cơ quan BHXH *"
      />
    </div>
  </div>
</template>

<script setup>
const model = defineModel({ type: Object, required: true })
</script>

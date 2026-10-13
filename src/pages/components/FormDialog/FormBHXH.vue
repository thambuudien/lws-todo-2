<template>
  <div class="row q-col-gutter-sm">
    <div
      class="col-12 text-subtitle2 text-green-9 text-weight-bold q-mt-md row items-center"
    >
      <q-icon name="trending_up" class="q-mr-xs" /> 📈 NGHIỆP VỤ BẢO HIỂM XÃ HỘI
      TỰ NGUYỆN
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.bhxhTuNgay"
        label="BHXH đóng từ ngày"
        mask="####-##-##"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.bhxhDenNgay"
        label="BHXH đóng đến ngày"
        mask="####-##-##"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        type="number"
        v-model.number="model.soThangBhxh"
        label="Số tháng đóng (Phương thức)"
        hint="Ví dụ: 3, 6, 12 tháng"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        type="number"
        v-model.number="model.mucThuNhapBhxh"
        label="Mức thu nhập lựa chọn đóng (VNĐ)"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        type="number"
        v-model.number="model.soTienBhxh"
        label="Số tiền thực nộp BHXH (VNĐ)"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.nhacDongBhxh"
        label="Ngày hẹn nhắn nhắc đóng BHXH"
        mask="####-##-##"
      />
    </div>
    <div class="col-12">
      <q-input
        filled
        dense
        v-model="model.ngayBienLaiBhxh"
        label="Ngày lập biên lai thu tiền BHXH"
        mask="####-##-##"
      />
    </div>

    <div
      class="col-12 text-subtitle2 text-orange-9 text-weight-bold q-mt-md row items-center"
    >
      <q-icon name="hub" class="q-mr-xs" /> 📍 THÔNG TIN ĐIỀU PHỐI TIN NHẮN &
      KIỂM SOÁT
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.sdtDongTien"
        label="SĐT người trực tiếp nộp tiền"
        mask="##########"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.sdtNhacHan"
        label="SĐT nhận tin nhắn nhắc hạn"
        mask="##########"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-select
        filled
        dense
        emit-value
        map-options
        v-model="model.tinhTrangHanThe"
        :options="[
          { label: 'Còn hạn sử dụng', value: 'CON_HAN' },
          { label: 'Sắp hết hạn', value: 'SAP_HET_HAN' },
          { label: 'Quá hạn thẻ', value: 'QUA_HAN' },
          { label: 'Chưa có thẻ (Mới tham gia) 📍', value: 'CHUA_CO_THE' },
        ]"
        label="Tình trạng hạn thẻ *"
      />
    </div>
    <div class="col-12">
      <q-input
        filled
        dense
        type="textarea"
        v-model="model.ghiChu"
        label="Ghi chú chi tiết đợt vận động tái tục..."
        rows="2"
      />
    </div>
  </div>
</template>

<script setup>
const model = defineModel({ type: Object, required: true });
</script>

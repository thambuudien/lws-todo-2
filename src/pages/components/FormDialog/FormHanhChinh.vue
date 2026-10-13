<template>
  <div class="row q-col-gutter-sm">
    <div
      class="col-12 text-subtitle2 text-primary text-weight-bold row items-center"
    >
      <q-icon name="badge" class="q-mr-xs" /> ĐỊNH DANH HÀNH CHÍNH CƠ BẢN
    </div>

    <!-- Mở khóa hoàn toàn cho phép sửa mã số BHXH/CCCD tự do -->
    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.maSoBhxh"
        label="Số định danh / CCCD 12 số *"
        mask="############"
        hint="Bắt buộc nhập đủ 12 số định danh"
        :rules="[
          (val) => !!val || 'Bắt buộc nhập mã số định danh',
          (val) => val.length === 12 || 'Mã định danh phải nhập đủ 12 số',
        ]"
      />
    </div>

    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.hoTen"
        label="Họ và tên khách hàng *"
        autocapitalize="characters"
        hint="Bắt buộc nhập họ tên"
        :rules="[(val) => !!val || 'Vui lòng không để trống họ tên']"
      />
    </div>

    <div class="col-12 col-sm-4">
      <q-select
        filled
        dense
        emit-value
        map-options
        v-model="model.gioiTinh"
        :options="[
          { label: 'Nam', value: true },
          { label: 'Nữ', value: false },
        ]"
        label="Giới tính"
      >
        <template v-slot:prepend>
          <q-icon
            :name="
              model.gioiTinh === true
                ? 'male'
                : model.gioiTinh === false
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
        v-model="model.ngaySinh"
        label="Ngày sinh (YYYY-MM-DD) *"
        mask="####-##-##"
        placeholder="Ví dụ: 1990-05-20"
        hint="Bắt buộc nhập ngày sinh"
        :rules="[
          (val) => !!val || 'Bắt buộc nhập ngày sinh',
          (val) =>
            /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Đúng định dạng YYYY-MM-DD',
        ]"
      />
    </div>

    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.soDienThoai"
        label="Số điện thoại liên hệ chính"
        mask="##########"
      />
    </div>

    <div class="col-12 col-sm-4">
      <q-input
        filled
        dense
        v-model="model.maHoGiaDinh"
        label="Mã hộ gia đình"
        placeholder="Ví dụ: HGĐ0012345"
      />
    </div>

    <div class="col-12 col-sm-6">
      <q-input
        filled
        dense
        v-model="model.maToKhaiRieng"
        label="Mã tờ khai riêng (Nếu có)"
      />
    </div>

    <div class="col-12 col-sm-6">
      <q-input
        filled
        dense
        v-model="model.donViDong"
        label="Đơn vị đóng hành chính"
        placeholder="Ví dụ: Cá nhân tự nguyện"
      />
    </div>
  </div>
</template>

<script setup>
const model = defineModel({ type: Object, required: true });
</script>

<template>
  <q-table
    flat
    bordered
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    no-data-label="Không tìm thấy hồ sơ bảo hiểm nào được gán cho bạn"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="primary"
            round
            dense
            :icon="props.expand ? 'expand_less' : 'expand_more'"
            @click="props.expand = !props.expand"
          />
        </q-td>
        <q-td key="maSoBhxh" :props="props" class="text-weight-bold">{{
          props.row.maSoBhxh
        }}</q-td>
        <q-td
          key="hoTen"
          :props="props"
          class="text-weight-bold text-indigo-10"
          >{{ props.row.hoTen }}</q-td
        >
        <q-td key="maHoGiaDinh" :props="props"
          ><q-badge color="teal" outline>{{
            props.row.maHoGiaDinh || "Trống"
          }}</q-badge></q-td
        >
        <q-td key="bhytDenNgay" :props="props">{{
          props.row.bhytDenNgay || "Chưa đóng"
        }}</q-td>
        <q-td key="tinhTrangHanThe" :props="props">
          <q-badge :color="getBadgeColor(props.row.tinhTrangHanThe)">{{
            getStatusLabel(props.row.tinhTrangHanThe)
          }}</q-badge>
        </q-td>
        <q-td key="actions" :props="props" auto-width>
          <q-btn
            flat
            round
            dense
            color="blue"
            icon="edit"
            @click="$emit('edit', props.row)"
          >
            <q-tooltip>Sửa thủ công</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>

      <!-- Row Expansion hiển thị thông tin nâng cao -->
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="q-pa-md bg-blue-grey-1 rounded-borders text-left">
            <div class="row q-col-gutter-md">
              <div
                class="col-12 col-sm-4 bg-white q-pa-md rounded-borders shadow-1 border-left-accent"
              >
                <div
                  class="text-subtitle2 text-purple text-weight-bold q-mb-sm"
                >
                  🏥 PHÂN HỆ BẢO HIỂM Y TẾ
                </div>
                <strong>Mã số thẻ BHYT:</strong>
                {{ props.row.maSoTheBhyt || "N/A" }} <br />
                <strong>Thời hạn thẻ:</strong> {{ props.row.bhytTuNgay }} →
                {{ props.row.bhytDenNgay }} <br />
                <strong>Số tiền đóng BHYT:</strong>
                {{ formatMoney(props.row.soTienBhyt) }}
              </div>
              <div
                class="col-12 col-sm-4 bg-white q-pa-md rounded-borders shadow-1 border-left-positive"
              >
                <div
                  class="text-subtitle2 text-green-9 text-weight-bold q-mb-sm"
                >
                  📈 PHÂN HỆ BHXH TỰ NGUYỆN
                </div>
                <strong>Thời gian đóng:</strong> {{ props.row.bhxhTuNgay }} →
                {{ props.row.bhxhDenNgay }} <br />
                <strong>Phương thức đóng:</strong>
                {{ props.row.soThangBhxh || 0 }} tháng <br />
                <strong>Số tiền đóng BHXH:</strong>
                {{ formatMoney(props.row.soTienBhxh) }}
              </div>
              <div
                class="col-12 col-sm-4 bg-white q-pa-md rounded-borders shadow-1 border-left-warning"
              >
                <div
                  class="text-subtitle2 text-orange-9 text-weight-bold q-mb-sm"
                >
                  📂 THÔNG TIN HÀNH CHÍNH & LIÊN HỆ
                </div>
                <strong>Mã tờ khai riêng:</strong>
                {{ props.row.maToKhaiRieng || "N/A" }} <br />
                <strong>SĐT nhận nhắc hạn:</strong>
                {{ props.row.sdtNhacHan || "N/A" }} <br />
                <strong>Ghi chú:</strong> {{ props.row.ghiChu || "Không có." }}
              </div>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});
defineEmits(["edit"]);

const columns = [
  { name: "expand", label: "Xem thêm", align: "center" },
  {
    name: "maSoBhxh",
    label: "Số ĐDCN / CCCD",
    field: "maSoBhxh",
    align: "left",
  },
  { name: "hoTen", label: "Họ và tên", field: "hoTen", align: "left" },
  {
    name: "maHoGiaDinh",
    label: "Mã hộ",
    field: "maHoGiaDinh",
    align: "center",
  },
  {
    name: "bhytDenNgay",
    label: "Hạn thẻ BHYT",
    field: "bhytDenNgay",
    align: "center",
  },
  {
    name: "tinhTrangHanThe",
    label: "Tình trạng",
    field: "tinhTrangHanThe",
    align: "center",
  },
  { name: "actions", label: "Sửa nhanh", align: "center" },
];

const formatMoney = (val) => (val ? val.toLocaleString("vi-VN") + " đ" : "0 đ");
const getBadgeColor = (val) =>
  val === "CON_HAN"
    ? "positive"
    : val === "SAP_HET_HAN"
    ? "warning"
    : "negative";
const getStatusLabel = (val) =>
  val === "CON_HAN"
    ? "Còn hạn"
    : val === "SAP_HET_HAN"
    ? "Sắp hết hạn"
    : "Quá hạn";
</script>

<style scoped>
.border-left-accent {
  border-left: 5px solid #9c27b0;
}
.border-left-positive {
  border-left: 5px solid #21ba45;
}
.border-left-warning {
  border-left: 5px solid #f2c037;
}
</style>

<template>
  <div class="bg-blue-grey-1 border-top q-pa-sm text-caption text-grey-9">
    <!-- 📱 NÚT TƯƠNG TÁC NHẮC HẠN SONG SONG ĐỒNG BỘ -->
    <div class="row q-col-gutter-xs q-mb-sm">
      <div class="col-6">
        <q-btn
          :color="isBhxhMode ? 'green-8' : 'indigo-7'"
          icon="chat"
          :label="isBhxhMode ? 'Zalo nhắc BHXH' : 'Zalo nhắc BHYT'"
          no-caps
          dense
          unelevated
          class="full-width text-weight-bold"
          @click="$emit('zalo', item)"
        />
      </div>
      <div class="col-6">
        <q-btn
          :color="isBhxhMode ? 'green-10' : 'teal-7'"
          icon="sms"
          :label="isBhxhMode ? 'SMS nhắc BHXH' : 'SMS nhắc BHYT'"
          no-caps
          dense
          unelevated
          class="full-width text-weight-bold"
          :href="smsLink"
        />
      </div>
    </div>

    <!-- 🌐 CỔNG LIÊN KẾT TRA CỨU TRỰC TUYẾN CHÈN THAM SỐ ĐỘNG -->
    <div class="row q-col-gutter-xs q-mb-sm">
      <div class="col-6">
        <q-btn
          color="blue-grey-8"
          icon="travel_explore"
          label="Tra cứu thẻ BHYT (VSS)"
          no-caps
          dense
          unelevated
          class="full-width text-weight-bold"
          @click="openLinkVss(item)"
        />
      </div>
      <div class="col-6">
        <q-btn
          color="orange-9"
          icon="find_in_page"
          label="Tra cứu thông tin (SSM)"
          no-caps
          dense
          unelevated
          class="full-width text-weight-bold"
          @click="openLinkSsm(item)"
        />
      </div>
    </div>

    <!-- KHỐI 1: PHÂN HỆ CHI TIẾT BẢO HIỂM Y TẾ -->
    <div
      class="bg-white q-pa-sm rounded-borders q-mb-xs shadow-1 border-left-accent"
    >
      <div class="text-weight-bold text-purple-8 q-mb-xs row items-center">
        <q-icon name="medical_services" class="q-mr-xs" /> PHÂN HỆ BẢO HIỂM Y TẾ
        HỘ GIA ĐÌNH
      </div>
      <div class="q-gutter-y-xs font-11">
        <div>
          <strong>Mã số thẻ BHYT (15 ký tự):</strong>
          <span
            :class="!item.maSoTheBhyt ? 'text-indigo text-weight-bold' : ''"
            >{{ item.maSoTheBhyt || "Chờ cấp mã thẻ mới đợt đầu" }}</span
          >
        </div>
        <div>
          <strong>Hạn thẻ BHYT sử dụng:</strong>
          {{ item.bhytTuNgay || "N/A" }} → {{ item.bhytDenNgay || "N/A" }}
        </div>
        <div>
          <strong>Số tiền đóng BHYT:</strong>
          {{ formatCurrency(item.soTienBhyt) }}
        </div>
        <div>
          <strong>Nơi đăng ký KCB ban đầu:</strong>
          {{ item.noiKcbBanDau || "Chưa cập nhật" }}
        </div>
        <div>
          <strong>Ngày đủ 5 năm liên tục:</strong>
          {{ item.ngay5NamLienTuc || "Chưa cập nhật" }}
        </div>
        <div>
          <strong>Ngày biên lai thu tiền BHYT:</strong>
          {{ item.ngayBienLaiBhyt || "Chưa lập biên lai" }}
        </div>
        <div>
          <strong>Tiến độ tại cơ quan BHXH:</strong>
          <q-badge
            :color="item.theoDoiCoQuanBhxh === 'CHUA_NOP' ? 'orange' : 'teal'"
            dense
            class="font-10"
          >
            {{
              item.theoDoiCoQuanBhxh === "CHUA_NOP"
                ? "Chưa nộp"
                : "Đã nộp - Chờ cơ quan BHXH phát sinh hạn mới"
            }}
          </q-badge>
        </div>
      </div>
    </div>

    <!-- KHỐI 2: PHÂN HỆ CHI TIẾT BHXH TỰ NGUYỆN -->
    <div
      class="bg-white q-pa-sm rounded-borders q-mb-xs shadow-1 border-left-positive"
    >
      <div class="text-weight-bold text-green-9 q-mb-xs row items-center">
        <q-icon name="trending_up" class="q-mr-xs" /> PHÂN HỆ BẢO HIỂM XÃ HỘI TỰ
        NGUYỆN
      </div>
      <div class="q-gutter-y-xs font-11">
        <div>
          <strong>Thời gian đóng BHXH:</strong>
          {{ item.bhxhTuNgay || "Chưa tham gia" }} →
          {{ item.bhxhDenNgay || "Chưa tham gia" }}
        </div>
        <div>
          <strong>Phương thức đóng:</strong> {{ item.phuongThucDong || "" }}
        </div>
        <div>
          <strong>Mức thu nhập lựa chọn đóng:</strong>
          {{ formatCurrency(item.mucThuNhapBhxh) }}
        </div>
        <div>
          <strong>Số tiền thực nộp vào quỹ BHXH:</strong>
          <span class="text-green-9 text-weight-bold">{{
            formatCurrency(item.soTienBhxh)
          }}</span>
        </div>
        <div>
          <strong>Ngày biên lai thu tiền BHXH:</strong>
          {{ item.ngayBienLaiBhxh || "Chưa lập biên lai" }}
        </div>
        <div>
          <strong>Ngày hệ thống hẹn nhắc đóng kỳ tiếp:</strong>
          <span class="text-red text-weight-bold">{{
            item.nhacDongBhxh || "N/A"
          }}</span>
        </div>
      </div>
    </div>

    <!-- KHỐI 3: THÔNG TIN HÀNH CHÍNH & KIỂM SOÁT HỘ GIA ĐÌNH -->
    <div class="bg-white q-pa-sm rounded-borders shadow-1 border-left-warning">
      <div class="text-weight-bold text-orange-9 q-mb-xs row items-center">
        <q-icon name="folder_shared" class="q-mr-xs" /> HÀNH CHÍNH QUẢN TRỊ &
        THÔNG TIN LIÊN HỆ
      </div>
      <div class="q-gutter-y-xs font-11">
        <div>
          <strong>Giới tính định danh:</strong>
          {{
            item.gioiTinh === true
              ? "Nam"
              : item.gioiTinh === false
              ? "Nữ"
              : "Chưa gán"
          }}
        </div>
        <div>
          <strong>Ngày tháng năm sinh:</strong>
          {{ item.ngaySinh || "Chưa cập nhật" }}
        </div>
        <div>
          <strong>Mã số quản lý hộ gia đình:</strong>
          {{ item.maHoGiaDinh || "Chưa lập mã hộ" }}
        </div>
        <div>
          <strong>Mã số tờ khai riêng biệt (TK1-TS):</strong>
          {{ item.maToKhaiRieng || "Chưa phát sinh" }}
        </div>
        <div>
          <strong>Đơn vị đóng hành chính:</strong>
          {{ item.donViDong || "Cá nhân tự đóng tự nguyện" }}
        </div>
        <div>
          <strong>Số điện thoại liên hệ chính:</strong>
          {{ item.soDienThoai || "Chưa có SĐT" }}
        </div>
        <div>
          <strong>Số điện thoại trực tiếp nộp tiền:</strong>
          {{ item.sdtDongTien || "Trùng với SĐT chính" }}
        </div>
        <div>
          <strong>Số điện thoại đăng ký nhận nhắn nhắc hạn:</strong>
          <span class="text-indigo text-weight-bold">{{
            item.sdtNhacHan || "Trùng với SĐT chính"
          }}</span>
        </div>
        <div>
          <strong>Trạng thái hạn thẻ (Hệ thống):</strong>
          <q-badge color="grey-9" dense class="font-10">{{
            item.tinhTrangHanThe
          }}</q-badge>
        </div>
        <div>
          <strong>Ngày khởi tạo hồ sơ gốc trên máy:</strong>
          {{ item.createdAt }}
        </div>
        <div>
          <strong>Trạng thái đồng bộ Backend:</strong>
          <q-badge
            :color="item.trangThai === 'PENDING' ? 'negative' : 'positive'"
            dense
            class="font-10"
            >{{ item.trangThai }}</q-badge
          >
        </div>

        <div class="q-mt-sm border-top-dash q-pt-xs">
          <strong>Ghi chú chi tiết của đại lý thu:</strong>
          <div
            class="text-italic text-grey-8 bg-grey-2 q-pa-xs rounded-borders q-mt-xs text-justify"
          >
            {{
              item.ghiChu ||
              "Không có nội dung ghi chú lưu ý nào cho đợt vận động này."
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";

const props = defineProps({
  item: { type: Object, required: true },
  smsLink: { type: String, default: "" },
  isBhxhMode: { type: Boolean, default: false },
});
const emit = defineEmits(["zalo", "fetchData"]);

const formatCurrency = (val) =>
  val ? val.toLocaleString("vi-VN") + " đ" : "0 đ";

/**
 * 🛠️ XỬ LÝ URL ENCODING TRA CỨU CỔNG BẢO HIỂM XÃ HỘI VIỆT NAM (VSS)
 * Tham số ngày sinh ép chuẩn Việt Nam: DD/MM/YYYY
 */
const openLinkVss = (customer) => {
  const codeBhy = customer.maSoBhxh || "";
  const fullName = encodeURIComponent(customer.hoTen || "");

  let birthDate = "";
  if (customer.ngaySinh) {
    birthDate = encodeURIComponent(
      moment(customer.ngaySinh, "YYYY-MM-DD").format("DD/MM/YYYY")
    );
  }

  const url = `https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-thoi-han-su-dung-the-bhyt.aspx?mathe=${codeBhy}&hoten=${fullName}&ngaysinh=${birthDate}`;
  window.open(url, "_blank");
};

/**
 * 🛠️ XỬ LÝ URL ENCODING TRA CỨU HỆ THỐNG SSM VNPOST
 * Tham số ngày sinh ép chuẩn Quốc tế: YYYY-MM-DD
 */
const openLinkSsm = (customer) => {
  const codeBhx = customer.maSoBhxh || "";
  const fullName = encodeURIComponent(customer.hoTen || "");
  const birthDate = customer.ngaySinh
    ? encodeURIComponent(customer.ngaySinh)
    : "";

  let url = "";
  if (props.isBhxhMode) {
    url = `https://ssm.vnpost.vn/qldv/tra-cuu/thong-tin-bhxh?maSoBHXH=${codeBhx}&hoTen=${fullName}&ngaySinhDt=${birthDate}`;
  } else {
    url = `https://ssm.vnpost.vn/qldv/tra-cuu/tra-cuu-thong-tin-the?maSoBHXH=${codeBhx}&hoTen=${fullName}&ngaySinhDt=${birthDate}`;
  }
  window.open(url, "_blank");
  setTimeout(() => {
    emit("fetchData");
  }, 5000);
};
</script>

<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}
.border-top-dash {
  border-top: 1px dashed #bdbdbd;
}
.border-left-accent {
  border-left: 4px solid #9c27b0;
}
.border-left-positive {
  border-left: 4px solid #21ba45;
}
.border-left-warning {
  border-left: 4px solid #f2c037;
}
.full-width {
  width: 100%;
}
.font-11 {
  font-size: 11.5px;
  line-height: 15px;
}
.font-10 {
  font-size: 10px;
  padding: 1px 4px;
}
</style>

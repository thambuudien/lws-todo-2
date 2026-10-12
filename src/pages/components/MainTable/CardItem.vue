<template>
  <q-card flat bordered class="mobile-card shadow-1">
    <!-- THANH TIÊU ĐỀ THẺ XEM NHANH -->
    <q-item class="q-py-md q-px-sm">
      <q-item-section
        @click="$emit('toggleExpand', item.id)"
        class="cursor-pointer"
      >
        <!-- HIỂN THỊ LIỀN NHAU: ICON GIỚI TÍNH, HỌ TÊN, NGÀY SINH -->
        <div
          class="row items-center no-wrap q-gutter-x-xs text-subtitle1 text-weight-bold text-indigo-10"
        >
          <q-icon
            :name="
              item.gioiTinh === true
                ? 'male'
                : item.gioiTinh === false
                ? 'female'
                : 'wc'
            "
            :color="
              item.gioiTinh === true
                ? 'blue-7'
                : item.gioiTinh === false
                ? 'pink-5'
                : 'grey-5'
            "
            size="22px"
          />
          <span class="ellipsis">{{ item.hoTen }}</span>
          <span
            class="text-caption text-grey-7 text-weight-medium"
            v-if="item.ngaySinh"
          >
            ({{ formatNgaySinh(item.ngaySinh) }})
          </span>
        </div>

        <q-item-label caption class="text-weight-bold text-grey-7 q-mt-xs">
          Số ĐDCN/CCCD: {{ item.maSoBhxh }}
        </q-item-label>

        <!-- KHU VỰC BADGE ĐỘC QUYỀN ĐÃ HOÁN ĐỔI ĐỒNG BỘ DỰA TRÊN Ô CHECKBOX -->
        <q-item-label caption class="row q-gutter-x-xs q-mt-xs">
          <!-- 📈 CHẾ ĐỘ 1: ĐANG CHECKBOX CHỈ XEM CHIẾN DỊCH BHXH -->
          <template v-if="isBhxhMode">
            <q-badge
              :color="getDynamicColorBhxh(item)"
              class="text-caption font-10 text-weight-bold"
            >
              <q-icon name="trending_up" size="14px" class="q-mr-xs" />
              BHXH: {{ getDynamicLabelBhxh(item) }}
            </q-badge>
          </template>

          <!-- 🏥 CHẾ ĐỘ 2: MẶC ĐỊNH CHỈ XEM CHIẾN DỊCH THEO HẠN THẺ BHYT (ĐÃ SỬA ĐỘNG) -->
          <template v-else>
            <q-badge
              :color="getDynamicColorBhyt(item)"
              class="text-caption font-10 text-weight-bold"
            >
              <q-icon name="medical_services" size="14px" class="q-mr-xs" />
              BHYT: {{ getDynamicLabelBhyt(item) }}
            </q-badge>
          </template>
        </q-item-label>
      </q-item-section>

      <!-- THANH NÚT HÀNH ĐỘNG GỌI VÀ SỬA NHANH -->
      <q-item-section side>
        <div class="row items-center q-gutter-x-xs">
          <q-btn
            size="sm"
            color="primary"
            flat
            round
            dense
            :icon="isExpanded ? 'expand_less' : 'expand_more'"
            @click="$emit('toggleExpand', item.id)"
          />
          <q-btn
            v-if="item.soDienThoai"
            flat
            round
            dense
            color="green-7"
            icon="phone"
            :href="`tel:${item.soDienThoai}`"
          />
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit_note"
            @click="$emit('edit', item)"
          />
        </div>
      </q-item-section>
    </q-item>

    <!-- NỘI DUNG CHI TIẾT ĐƯỢC CHIA TÁCH BUNG MỞ -->
    <q-slide-transition>
      <CardExpansion
        v-show="isExpanded"
        :item="item"
        :smsLink="smsLink"
        :is-bhxh-mode="isBhxhMode"
        @zalo="$emit('zalo', item)"
      />
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import moment from "moment";

defineProps({
  item: { type: Object, required: true },
  isExpanded: { type: Boolean, default: false },
  isBhxhMode: { type: Boolean, default: false },
  smsLink: { type: String, default: "" },
});
defineEmits(["toggleExpand", "edit", "zalo"]);

// Mốc thời gian thực tế hiện tại của hệ thống đại lý thu
const homNay = moment("2026-10-12");

const formatNgaySinh = (dateStr) =>
  dateStr ? moment(dateStr, "YYYY-MM-DD").format("DD/MM/YYYY") : "";

/**
 * 🏥 SỬA LỖI LOGIC: HÀM TÍNH TOÁN ĐỘNG MÀU SẮC BADGE CHO BHYT TRÊN RAM
 */
const getDynamicColorBhyt = (item) => {
  // Ưu tiên check nếu hồ sơ lưu là người tham gia mới hoàn toàn chưa phát hành thẻ
  if (
    item.tinhTrangHanThe === "CHUA_CO_THE" ||
    !item.bhytDenNgay ||
    item.bhytDenNgay.trim() === ""
  ) {
    return "indigo-7";
  }

  const hanBhy = moment(item.bhytDenNgay, "YYYY-MM-DD");

  if (hanBhy.isBefore(homNay)) {
    return "negative"; // Đã trôi qua hôm nay -> Màu đỏ quá hạn
  }
  // Nếu ngày hết hạn nằm trong vòng 30 ngày tới -> Màu vàng sắp hết hạn
  if (hanBhy.isSameOrBefore(moment(homNay).add(30, "days"))) {
    return "warning";
  }
  return "positive"; // Còn hạn an toàn -> Màu xanh lá
};

/**
 * 🏥 SỬA LỖI LOGIC: HÀM HIỂN THỊ VĂN BẢN TIẾNG VIỆT ĐỘNG CHO HẠN THẺ BHYT
 */
const getDynamicLabelBhyt = (item) => {
  if (
    item.tinhTrangHanThe === "CHUA_CO_THE" ||
    !item.bhytDenNgay ||
    item.bhytDenNgay.trim() === ""
  ) {
    return "Mới tham gia (Chưa có thẻ)";
  }

  const hanBhy = moment(item.bhytDenNgay, "YYYY-MM-DD");
  const dinhDangNgay = hanBhy.format("DD/MM/YYYY");

  if (hanBhy.isBefore(homNay)) {
    const soNgayTre = homNay.diff(hanBhy, "days");
    return `Quá hạn ${soNgayTre} ngày (${dinhDangNgay})`;
  }

  if (hanBhy.isSameOrBefore(moment(homNay).add(30, "days"))) {
    const soNgayConLai = hanBhy.diff(homNay, "days");
    return `Sắp hết hạn - Còn ${soNgayConLai} ngày (${dinhDangNgay})`;
  }

  return `Còn hạn (${dinhDangNgay})`;
};

/**
 * 📈 HÀM ĐỔI MÀU BADGE BHXH TỰ NGUYỆN (GIỮ NGUYÊN CHUẨN ĐÃ ĐỒNG BỘ)
 */
const getDynamicColorBhxh = (item) => {
  const ngayKiemTraStr =
    item.nhacDongBhxh && item.nhacDongBhxh.trim() !== ""
      ? item.nhacDongBhxh
      : item.bhxhDenNgay;
  if (!ngayKiemTraStr || ngayKiemTraStr.trim() === "") return "grey-7";

  const ngayMucTieu = moment(ngayKiemTraStr, "YYYY-MM-DD");
  const thangHienTai = homNay.format("YYYY-MM");

  if (item.nhacDongBhxh && item.nhacDongBhxh.trim() !== "") {
    if (ngayMucTieu.format("YYYY-MM") < thangHienTai) return "negative";
    if (
      ngayMucTieu.format("YYYY-MM") <=
      moment(homNay).add(1, "month").format("YYYY-MM")
    )
      return "warning";
    return "positive";
  } else {
    if (ngayMucTieu.isBefore(homNay)) return "negative";
    if (ngayMucTieu.isBefore(moment(homNay).add(30, "days"))) return "warning";
    return "positive";
  }
};

/**
 * 📈 HÀM ĐỔI VĂN BẢN TIẾNG VIỆT CHO HẠN THẺ BHXH (GIỮ NGUYÊN CHUẨN ĐÃ ĐỒNG BỘ)
 */
const getDynamicLabelBhxh = (item) => {
  const ngayKiemTraStr =
    item.nhacDongBhxh && item.nhacDongBhxh.trim() !== ""
      ? item.nhacDongBhxh
      : item.bhxhDenNgay;
  if (!ngayKiemTraStr || ngayKiemTraStr.trim() === "") return "Chưa tham gia";

  const ngayMucTieu = moment(ngayKiemTraStr, "YYYY-MM-DD");
  const thangHienTai = homNay.format("YYYY-MM");

  if (item.nhacDongBhxh && item.nhacDongBhxh.trim() !== "") {
    if (ngayMucTieu.format("YYYY-MM") < thangHienTai) {
      return `Quá hạn (Tháng ${ngayMucTieu.format("MM/YYYY")})`;
    }
    return `Đóng trong tháng ${ngayMucTieu.format("MM/YYYY")}`;
  } else {
    if (ngayMucTieu.isBefore(homNay)) return "Quá hạn nộp";
    if (ngayMucTieu.isBefore(moment(homNay).add(30, "days")))
      return "Đến kỳ đóng";
    return `Còn hạn (${ngayMucTieu.format("DD/MM/YYYY")})`;
  }
};
</script>

<style scoped>
.mobile-card {
  border-radius: 8px;
  overflow: hidden;
}
.font-10 {
  font-size: 10px;
  padding: 2px 4px;
}
</style>

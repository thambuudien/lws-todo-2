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
          <span class="ellipsis"
            >{{ item.hoTen }} {{ item.ngaySinh.slice(0, 4) }}</span
          >
          <!-- <span
            class="text-caption text-grey-7 text-weight-medium"
            v-if="item.ngaySinh"
          >
            ({{ formatNgaySinh(item.ngaySinh) }})
          </span> -->
        </div>
        <q-item-label caption class="text-grey-7 q-mt-xs">
          {{ item.diaChiLienHe }}
        </q-item-label>
        <q-item-label
          v-if="item.maHoGiaDinh"
          caption
          class="text-grey-7 q-mt-xs row items-center"
          ><q-btn
            flat
            round
            dense
            size="sm"
            icon="search"
            class="q-mr-xs"
            @click.stop="$emit('searchByMaHoGiaDinh', item.maHoGiaDinh)"
          />
          <span>{{ item.maHoGiaDinh }} - Mã HGD</span>
        </q-item-label>

        <q-item-label
          v-if="item.maToKhaiRieng"
          caption
          class="text-grey-7 q-mt-xs row items-center"
          ><q-btn
            flat
            round
            dense
            size="sm"
            icon="search"
            class="q-mr-xs"
            @click.stop="$emit('searchByMaHoGiaDinh', item.maToKhaiRieng)"
          />
          <span>{{ item.maToKhaiRieng }} - TKR</span>
        </q-item-label>

        <q-item-label
          caption
          class="text-weight-bold text-grey-7 q-mt-xs row items-center"
        >
          <span
            >Mã thẻ: {{ maskedCode(item.maSoTheBhyt || item.maSoBhxh) }}</span
          >
          <q-btn
            flat
            round
            dense
            size="sm"
            icon="content_copy"
            @click.stop="
              copy(
                `${item.hoTen}, ${item.maSoBhxh}, ${new Date(
                  item.ngaySinh
                ).toLocaleDateString('vi-VN')}, `
              )
            "
            class="q-ml-xs"
          />
        </q-item-label>

        <q-item-label caption class="text-grey-7 q-mt-xs col items-center">
          <div v-if="item.bhytDenNgay">
            <strong>Từ:</strong>
            {{ formatNgayBienLai(item.bhytTuNgay) }} →
            <strong>{{ formatNgayBienLai(item.bhytDenNgay) }}</strong>
          </div>
          <div>
            <q-badge :color="getDynamicColorBhyt(item)">
              {{ getDynamicLabelBhyt(item) }}
            </q-badge>
          </div>

          <strong>Nơi KCB: </strong>{{ item.noiKcbBanDau || "Chưa cập nhật" }}
          <div>
            <strong>5 năm liên tục:</strong>
            {{ item.ngay5NamLienTuc || "Chưa cập nhật" }}
          </div>
          <div>

            <strong>Số ĐT: </strong>
              <a :href="`tel:${item.soDienThoai}`"
              >{{ maskPhoneNumber(item.soDienThoai) }}
            </a>
            <q-btn
              v-if="item.soDienThoai"
              flat
              round
              dense
              size="sm"
              color="green-7"
              icon="content_copy"
              class="q-ml-sm"
              @click.stop="copy(item.soDienThoai)"
            />

          </div>
        </q-item-label>

        <!-- KHU VỰC BADGE ĐỘC QUYỀN ĐÃ HOÁN ĐỔI ĐỒNG BỘ DỰA TRÊN Ô CHECKBOX -->
        <q-item-label caption class="row q-gutter-x-xs q-mt-xs">
          <q-badge
            v-if="item.soTienBhxh"
            :color="getDynamicColorBhxh(item)"
            class="text-caption font-10 text-weight-bold"
          >
            <q-icon name="trending_up" size="14px" class="q-mr-xs" />
            BHXH: {{ getDynamicLabelBhxh(item) }}
          </q-badge>
        </q-item-label>
      </q-item-section>

      <!-- THANH NÚT HÀNH ĐỘNG GỌI VÀ SỬA NHANH -->
      <q-item-section side top>
        <div class="q-gutter-x-xs">
          <q-btn size="12px" flat dense round icon="more_horiz">
            <q-menu>
              <q-list style="min-width: 300px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="openPviWindow(item, 'bhyt-renew')"
                    >Gia hạn nối tiếp thẻ BHYT với PVI</q-item-section
                  >
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="openPviWindow(item, 'bhxh-renew')"
                    >Gia hạn nối tiếp BHXH với PVI</q-item-section
                  >
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="openPviWindow(item, 'bhyt-new')"
                    >Đăng ký mới BHYT với PVI</q-item-section
                  >
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="openPviWindow(bhyt, 'bhxh-new')"
                    >Đăng ký mới BHXH với PVI</q-item-section
                  >
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section @click="openLinkSsm(item, isBhxhMode)"
                    >Tra cứu thông tin thẻ BHYT trên SSM</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            @click="$emit('loaiBoThanhVien', item.id)"
            size="12px"
            flat
            dense
            round
            icon="close"
          />
        </div>
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
        <div>
          <template v-if="isBhxhMode">
            <div class="row items-center q-mb-xs">
              <q-icon
                name="payments"
                color="orange-8"
                size="xs"
                class="q-mr-xs"
              />
              <span class="text-weight-bold">{{
                formatCurrency(item.soTienBhxh)
              }}</span>
            </div>
            <div class="text-caption text-grey-7">
              Ngày nộp: {{ formatNgayBienLai(item.ngayBienLaiBhxh) }}
            </div>
            <div class="text-caption text-grey-7">
              <div>
                <strong>Mức: {{ formatCurrency(item.mucThuNhapBhxh) }}</strong>
              </div>
              <div>
                <strong>Đóng: {{ item.phuongThucDong || "" }}</strong> (tháng)
              </div>
            </div>
          </template>
          <template v-else-if="item.soTienBhyt">
            <div class="row items-center q-mb-xs">
              <q-icon
                name="payments"
                color="orange-8"
                size="xs"
                class="q-mr-xs"
              />
              <span class="text-weight-bold">{{
                formatCurrency(item.soTienBhyt)
              }}</span>
            </div>
            <div class="text-caption text-grey-7">
              Ngày nộp: {{ formatNgayBienLai(item.ngayBienLaiBhyt) }}
            </div>
            <div>
              <q-badge
                :color="
                  item.theoDoiCoQuanBhxh === 'Đã nhận kết quả phát sinh từ BHXH'
                    ? 'orange'
                    : 'teal'
                "
                dense
                class="font-10 ellipsis inline-block"
                style="max-width: 120px"
              >
                {{ item.tinhTrangHanThe || "Đang cập nhật.." }}

                <!-- Hiển thị đầy đủ nội dung khi rê chuột vào nếu chuỗi bị dài -->
                <q-tooltip
                  v-if="item.tinhTrangHanThe"
                  anchor="top middle"
                  self="bottom middle"
                >
                  {{ item.tinhTrangHanThe }}
                </q-tooltip>
              </q-badge>
            </div>
          </template>
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
        @fetchData="$emit('fetchData')"
      />
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import moment from "moment";
import CardExpansion from "./CardExpansion.vue";
import { useExternalLinks } from "../../../composables/useLinking";
import { useQuasar, copyToClipboard } from "quasar";
const $q = useQuasar();
const { openLinkSsm } = useExternalLinks();

defineProps({
  item: { type: Object, required: true },
  isExpanded: { type: Boolean, default: false },
  isBhxhMode: { type: Boolean, default: false },
  smsLink: { type: String, default: "" },
});
defineEmits([
  "toggleExpand",
  "edit",
  "zalo",
  "fetchData",
  "loaiBoThanhVien",
  "searchByMaHoGiaDinh",
]);

// Mốc thời gian thực tế hiện tại của hệ thống đại lý thu
const homNay = moment(new Date());
const formatCurrency = (val) =>
  val ? val.toLocaleString("vi-VN") + " đ" : "0 đ";
const maskedCode = (codeString) => {
  if (typeof codeString !== "string" || codeString.length <= 6) return "***";

  const visibleLen = 3;
  const maskedLen = codeString.length - visibleLen * 2;

  return (
    codeString.slice(0, visibleLen) +
    "*".repeat(maskedLen) +
    codeString.slice(-visibleLen)
  );
};

const maskPhoneNumber = (phoneString) =>
  phoneString && phoneString.length >= 10
    ? `${phoneString.slice(0, 4)}****${phoneString.slice(-2)}`
    : "***";

const formatNgayBienLai = (dateStr) =>
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
  if (!item.bhytDenNgay || item.bhytDenNgay.trim() === "") {
    return "Chưa có thẻ";
  }

  const hanBhy = moment(item.bhytDenNgay, "YYYY-MM-DD");

  if (hanBhy.isBefore(homNay)) {
    const soNgayTre = homNay.diff(hanBhy, "days");
    return `Quá hạn ${soNgayTre} ngày`;
  }
  const soNgayConLai = hanBhy.diff(homNay, "days");
  if (hanBhy.isSameOrBefore(moment(homNay).add(30, "days"))) {
    return `Sắp hết hạn - Còn ${soNgayConLai} ngày`;
  }

  return `Còn hạn ${soNgayConLai} ngày`;
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

const copy = (text) => {
  copyToClipboard(text)
    .then(() => {
      $q.notify({
        color: "positive",
        message: `Đã sao chép vào clipboard: ${text}`,
        icon: "content_copy",
      });
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        message: "Lỗi sao chép",
        icon: "report_problem",
      });
    });
};

const openPviWindow = (bhyt, type) => {
  const maSo = bhyt.maSoBhxh;
  const hoTen = bhyt.hoTen || bhyt.hoTen;
  const date = new Date(bhyt.ngaySinh);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const ngaySinh = `${day}/${month}/${year}`;
  let url = `https://bhxh.pvi.com.vn/#/`;

  switch (type) {
    case "bhyt-renew":
      url += `bhyt/bhyt-renew?ms=${maSo}&ten=${hoTen}&ns=${ngaySinh}`;
      break;
    case "bhxh-renew":
      url += `bhxh/bhxh-renew?ms=${maSo}&ten=${hoTen}&ns=${ngaySinh}`;
      break;
    case "bhyt-new":
      url += `bhyt/bhyt-new?ms=${maSo}&ten=${hoTen}&ns=${ngaySinh}`;
      break;
    case "bhxh-new":
      url += `bhxh/bhxh-new?ms=${maSo}&ten=${hoTen}&ns=${ngaySinh}`;
      break;
  }
  window.open(url, "_blank");
};

/**
 * 📈 HÀM ĐỔI VĂN BẢN TIẾNG VIỆT CHO HẠN THẺ BHXH (GIỮ NGUYÊN CHUẨN ĐÃ ĐỒNG BỘ)
 */
const getDynamicLabelBhxh = (item) => {
  const ngayKiemTraStr =
    item.nhacDongBhxh && item.nhacDongBhxh.trim() !== ""
      ? item.nhacDongBhxh
      : "";
  if (!ngayKiemTraStr || ngayKiemTraStr.trim() === "") return "Chưa cập nhật";

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

<template>
  <div class="q-px-xs q-pb-xl">
    <!-- TRẠNG THÁI LOADING MẠNG -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="text-grey-7 q-mt-sm text-caption">
        Đang bóc tách dữ liệu cục bộ...
      </div>
    </div>

    <!-- TRẠNG THÁI DANH SÁCH TRỐNG -->
    <div
      v-else-if="!rows || rows.length === 0"
      class="text-center q-pa-xl bg-white rounded-borders shadow-1 text-grey-6"
    >
      <q-icon name="badge" size="48px" class="q-mb-sm text-grey-4" />
      <div class="text-weight-bold">Không tìm thấy dữ liệu phù hợp</div>
    </div>

    <!-- VÒNG LẶP RENDER CÁC THẺ CARDITEM -->
    <div v-else class="q-gutter-y-sm">
      <CardItem
        v-for="item in rows"
        :key="item.id"
        :item="item"
        :is-expanded="expandedCards.includes(item.id)"
        :is-bhxh-mode="isBhxhMode"
        :smsLink="generateSmsLink(item)"
        @toggleExpand="toggleExpand"
        @edit="(val) => $emit('edit', val)"
        @zalo="sendZaloDynamic"
        @fetchData="$emit('fetchData')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { copyToClipboard, useQuasar } from "quasar";
import CardItem from "./CardItem.vue";

const props = defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  isBhxhMode: { type: Boolean, default: false }, // Nhận trạng thái Checkbox từ IndexPage
});
const emit = defineEmits(["edit", "fetchData"]);

const $q = useQuasar();
const expandedCards = ref([]);

const toggleExpand = (id) => {
  expandedCards.value = expandedCards.value.includes(id)
    ? expandedCards.value.filter((c) => c !== id)
    : [...expandedCards.value, id];
};

/**
 * 🧩 THUẬT TOÁN TẠO VĂN BẢN ĐƠN PHÂN HỆ ĐỘNG DỰA VÀO CHECKBOX (KHÔNG NHẮC GỘP)
 */
const buildDynamicMessage = (item) => {
  let msg = `Kính gửi Ông/Bà ${item.hoTen},\n`;

  if (props.isBhxhMode) {
    // CHẾ ĐỘ 1: TÍCH CHỌN CHECKBOX -> CHỈ NHẮC ĐÓNG TIỀN BHXH TỰ NGUYỆN
    msg += `Đại lý thu bảo hiểm xin thông báo: Sổ BHXH tự nguyện của Ông/Bà đến hạn đóng kỳ tiếp theo vào ngày ${
      item.bhxhDenNgay || "kỳ tới"
    }.\n`;
    msg += `Kính mong Ông/Bà chủ động chuẩn bị tài chính liên hệ Nhân viên thu để đóng tiền giữ tiến độ tham gia liên tục, bảo toàn thời gian tích lũy lương hưu an sinh.`;
  } else {
    // CHẾ ĐỘ 2: KHÔNG TÍCH CHỌN CHECKBOX -> CHỈ NHẮC ĐÓNG TIỀN BHYT
    if (item.tinhTrangHanThe === "CHUA_CO_THE") {
      msg += `Đại lý thu bảo hiểm xin thông báo: Hồ sơ đăng ký tham gia BHYT mới đợt đầu của Ông/Bà đang được nộp chờ cấp mã số phát hành hạn thẻ mới.\n`;
    } else {
      msg += `Đại lý thu bảo hiểm xin thông báo: Thẻ BHYT hộ gia đình của Ông/Bà sẽ hết hạn sử dụng vào ngày ${
        item.bhytDenNgay || "tới đây"
      }.\n`;
    }
    msg += `Kính mong Ông/Bà chủ động liên hệ Nhân viên thu để gia hạn đóng tiền kịp thời, tránh gián đoạn quyền lợi khám chữa bệnh bảo hiểm y tế.`;
  }

  msg += `\nHotline hỗ trợ thực địa: Số điện thoại này. Trân trọng!`;
  return msg;
};

const generateSmsLink = (item) => {
  const phone = item.sdtNhacHan || item.soDienThoai || "";
  return `sms:${phone}?body=${encodeURIComponent(buildDynamicMessage(item))}`;
};

const sendZaloDynamic = (item) => {
  const phone = item.sdtNhacHan || item.sdtDongTien || item.soDienThoai || "";
  const txtMessage = buildDynamicMessage(item);

  copyToClipboard(txtMessage).then(() => {
    $q.notify({
      color: props.isBhxhMode ? "green-8" : "indigo",
      icon: "content_copy",
      position: "top",
      timeout: 2000,
      message: `Đã sao chép tin nhắn nhắc ${
        props.isBhxhMode ? "BHXH" : "BHYT"
      }! Hãy dán vào Zalo.`,
    });
    setTimeout(() => {
      window.open(`https://zalo.me/${phone}`, "_blank");
    }, 800);
  });
};
</script>

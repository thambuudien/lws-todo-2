<template>
  <div class="q-px-sm q-pb-xl">
    <!-- TRẠNG THÁI LOADING -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="text-grey-7 q-mt-sm">Đang tải dữ liệu...</div>
    </div>

    <!-- KHÔNG CÓ DỮ LIỆU -->
    <div v-else-if="!rows || rows.length === 0" class="text-center q-pa-xl bg-white rounded-borders shadow-1 text-grey-6">
      <q-icon name="person_off" size="50px" class="q-mb-sm text-grey-4" />
      <div>Không tìm thấy hồ sơ phù hợp.</div>
    </div>

    <!-- DANH SÁCH THẺ DI ĐỘNG PWA -->
    <div v-else class="q-gutter-sm">
      <q-card v-for="item in rows" :key="item.id" flat bordered class="mobile-card shadow-1">

        <!-- THANH TIÊU ĐỀ THẺ (THÔNG TIN CỐT LÕI) -->
        <q-item class="q-py-sm">
          <q-item-section avatar>
            <q-avatar :color="getBadgeColor(item.tinhTrangHanThe)" text-color="white" icon="person" size="md" />
          </q-item-section>

          <q-item-section @click="toggleExpand(item.id)" class="cursor-pointer">
            <q-item-label class="text-weight-bold text-subtitle1 text-indigo-10">{{ item.hoTen }}</q-item-label>
            <q-item-label caption class="text-weight-medium">CCCD: {{ item.maSoBhxh }}</q-item-label>
            <q-item-label caption class="row q-gutter-x-xs q-mt-xs">
              <q-badge :color="getBadgeColor(item.tinhTrangHanThe)">
                BHYT: {{ item.bhytDenNgay || 'Chưa tham gia' }}
              </q-badge>
              <q-badge color="green-8" v-if="item.bhxhDenNgay">
                BHXH: {{ item.bhxhDenNgay }}
              </q-badge>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-x-xs">
              <q-btn v-if="item.soDienThoai" flat round dense color="green" icon="phone" :href="`tel:${item.soDienThoai}`" />
              <q-btn flat round dense color="blue" icon="edit" @click="$emit('edit', item)" />
            </div>
          </q-item-section>
        </q-item>

        <!-- KHU VỰC CHI TIẾT BUNG MỞ (KHI BẤM VÀO THẺ) -->
        <q-slide-transition>
          <div v-show="expandedCards.includes(item.id)" class="bg-blue-grey-1 border-top q-pa-sm text-caption">

            <!-- 📱 KHU VỰC NHẮC HẠN SONG SONG ĐỘNG (GỘP BHYT & BHXH) -->
            <div class="row q-col-gutter-xs q-mb-sm">
              <div class="col-6">
                <!-- Zalo gửi tin nhắn sao chép nhanh -->
                <q-btn
                  color="indigo-7" icon="chat" label="Zalo nhắc gộp"
                  no-caps dense unelevated class="full-width"
                  @click="sendZaloGop(item)"
                />
              </div>
              <div class="col-6">
                <!-- SMS sử dụng deep link gửi trực tiếp -->
                <q-btn
                  color="teal-7" icon="sms" label="SMS nhắc gộp"
                  no-caps dense unelevated class="full-width"
                  :href="generateSmsHref(item)"
                />
              </div>
            </div>

            <!-- 29 TRƯỜNG NGHIỆP VỤ HIỂN THỊ DẠNG TABS THU GỌN -->
            <div class="bg-white q-pa-sm rounded-borders q-mb-xs">
              <div class="text-weight-bold text-purple q-mb-xs">🏥 PHÂN HỆ BẢO HIỂM Y TẾ</div>
              <div><strong>Mã số thẻ:</strong> {{ item.maSoTheBhyt || 'N/A' }}</div>
              <div><strong>Thời hạn sử dụng:</strong> {{ item.bhytTuNgay }} → {{ item.bhytDenNgay }}</div>
              <div><strong>Số tiền đóng BHYT:</strong> {{ formatMoney(item.soTienBhyt) }}</div>
              <div><strong>Tiến độ nộp BHXH:</strong> <q-badge color="purple" dense>{{ item.theoDoiCoQuanBhxh }}</q-badge></div>
            </div>

            <div class="bg-white q-pa-sm rounded-borders q-mb-xs">
              <div class="text-weight-bold text-green-9 q-mb-xs">📈 PHÂN HỆ BHXH TỰ NGUYỆN</div>
              <div><strong>Thời gian đóng:</strong> {{ item.bhxhTuNgay }} → {{ item.bhxhDenNgay }}</div>
              <div><strong>Phương thức đóng:</strong> {{ item.soThangBhxh || 0 }} tháng | <strong>Số tiền nộp:</strong> {{ formatMoney(item.soTienBhxh) }}</div>
              <div><strong>Mức thu nhập chọn:</strong> {{ formatMoney(item.mucThuNhapBhxh) }}</div>
              <div><strong>Ngày nhắc đóng BHXH:</strong> <span class="text-red text-weight-bold">{{ item.nhacDongBhxh || 'N/A' }}</span></div>
            </div>

            <div class="bg-white q-pa-sm rounded-borders">
              <div class="text-weight-bold text-orange-9 q-mb-xs">📂 HÀNH CHÍNH & LIÊN HỆ GIA ĐÌNH</div>
              <div><strong>Mã hộ GD:</strong> {{ item.maHoGiaDinh || 'N/A' }} | <strong>Mã tờ khai:</strong> {{ item.maToKhaiRieng || 'N/A' }}</div>
              <div><strong>SĐT nộp tiền:</strong> {{ item.sdtDongTien || 'N/A' }} | <strong>SĐT nhắc hạn:</strong> {{ item.sdtNhacHan || 'N/A' }}</div>
              <div><strong>Ghi chú đại lý:</strong> <span class="text-italic text-grey-8">{{ item.ghiChu || 'Không có.' }}</span></div>
            </div>

          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
defineEmits(['edit'])

const $q = useQuasar()
const expandedCards = ref([])

const toggleExpand = (id) => {
  if (expandedCards.value.includes(id)) {
    expandedCards.value = expandedCards.value.filter(cardId => cardId !== id)
  } else {
    expandedCards.value.push(id)
  }
}

// 🧩 LOGIC KHỞI TẠO TIN NHẮN GỘP THÔNG MINH
const generateCombinedMessage = (item) => {
  let msg = `Kính gửi Ông/Bà ${item.hoTen},\n`
  msg += `Đại lý thu BHXH, BHYT xin thông báo thời hạn tham gia bảo hiểm của Ông/Bà như sau:\n`

  // Kiểm tra hạn BHYT
  if (item.bhytDenNgay) {
    msg += `- Thẻ BHYT sẽ hết hạn vào ngày: ${item.bhytDenNgay}.\n`
  }

  // Kiểm tra hạn BHXH Tự nguyện
  if (item.bhxhDenNgay) {
    msg += `- BHXH Tự nguyện đóng đến ngày: ${item.bhxhDenNgay}.\n`
  }

  msg += `Để đảm bảo quyền lợi khám chữa bệnh liên tục và tích lũy an sinh thời gian đóng bảo hiểm, kính mong Ông/Bà chủ động chuẩn bị tài chính để thực hiện gia hạn đợt mới.\n`
  msg += `Mọi chi tiết xin vui lòng liên hệ Nhân viên thu qua số điện thoại này. Trân trọng!`
  return msg
}

// Gửi SMS thông qua deep link cấu hình sẵn nội dung gộp
const generateSmsHref = (item) => {
  const phone = item.sdtNhacHan || item.soDienThoai || ''
  const body = generateCombinedMessage(item)
  return `sms:${phone}?body=${encodeURIComponent(body)}`
}

// Gửi tin nhắn qua Zalo (Tự động sao chép nội dung gộp vào bộ nhớ tạm và mở nhanh Zalo khách hàng)
const sendZaloGop = (item) => {
  const phone = item.sdtNhacHan || item.soDienThoai || ''
  const message = generateCombinedMessage(item)

  copyToClipboard(message)
    .then(() => {
      $q.notify({
        color: 'indigo',
        icon: 'content_copy',
        message: 'Đã sao chép nội dung mẫu! Bạn chỉ cần dán (Paste) khi Zalo mở ra.',
        position: 'top',
        timeout: 2500
      })
      // Mở deep link chat Zalo số điện thoại khách hàng sau 1 giây
      setTimeout(() => {
        window.open(`https://zalo.me{phone}`, '_blank')
      }, 1000)
    })
    .catch(() => {
      $q.notify({ color: 'negative', message: 'Không thể sao chép văn bản tự động.' })
    })
}

const formatMoney = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ'
const getBadgeColor = (val) => val === 'CON_HAN' ? 'positive' : (val === 'SAP_HET_HAN' ? 'warning' : 'negative')
const getStatusLabel = (val) => val === 'CON_HAN' ? 'Còn hạn' : (val === 'SAP_HET_HAN' ? 'Sắp hết hạn' : 'Quá hạn')
</script>

<style scoped>
.mobile-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.full-width {
  width: 100%;
}
</style>

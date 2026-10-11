<template>
  <div class="q-px-xs q-pb-xl">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="text-grey-7 q-mt-sm text-caption">Đang bóc tách dữ liệu cục bộ...</div>
    </div>

    <div v-else-if="!rows || rows.length === 0" class="text-center q-pa-xl bg-white rounded-borders shadow-1 text-grey-6">
      <q-icon name="badge" size="48px" class="q-mb-sm text-grey-4" />
      <div class="text-weight-bold">Không tìm thấy dữ liệu phù hợp</div>
    </div>

    <div v-else class="q-gutter-y-sm">
      <q-card v-for="item in rows" :key="item.id" flat bordered class="mobile-card shadow-1">
        <q-item class="q-py-md q-px-sm">
          <q-item-section @click="toggleExpand(item.id)" class="cursor-pointer">
            <!-- HIỂN THỊ LIỀN NHAU: ICON GIỚI TÍNH, HỌ TÊN, NGÀY SINH -->
            <div class="row items-center no-wrap q-gutter-x-xs text-subtitle1 text-weight-bold text-indigo-10">
              <q-icon
                :name="item.gioiTinh === true ? 'male' : (item.gioiTinh === false ? 'female' : 'wc')"
                :color="item.gioiTinh === true ? 'blue-7' : (item.gioiTinh === false ? 'pink-5' : 'grey-5')"
                size="22px"
              />
              <span class="ellipsis">{{ item.hoTen }}</span>
              <span class="text-caption text-grey-7 text-weight-medium" v-if="item.ngaySinh">
                ({{ formatNgaySinh(item.ngaySinh) }})
              </span>
            </div>

            <q-item-label caption class="text-weight-bold text-grey-7 q-mt-xs">
              Số ĐDCN/CCCD: {{ item.maSoBhxh }}
            </q-item-label>
            <q-item-label caption class="row q-gutter-x-xs q-mt-xs">
              <q-badge :color="getBadgeColor(item.tinhTrangHanThe)" class="text-caption font-10">
                BHYT: {{ getStatusLabel(item.tinhTrangHanThe) }} ({{ item.bhytDenNgay || 'Chưa đóng' }})
              </q-badge>
              <q-badge color="green-8" class="text-caption font-10" v-if="item.bhxhDenNgay">
                BHXH: {{ item.bhxhDenNgay }}
              </q-badge>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-x-xs">
              <q-btn v-if="item.soDienThoai" flat round dense color="green-7" icon="phone" :href="`tel:${item.soDienThoai}`" />
              <q-btn flat round dense color="primary" icon="edit_note" @click="$emit('edit', item)" />
            </div>
          </q-item-section>
        </q-item>

        <q-slide-transition>
          <div v-show="expandedCards.includes(item.id)" class="bg-blue-grey-1 border-top q-pa-sm text-caption text-grey-9">
            <div class="row q-col-gutter-xs q-mb-sm">
              <div class="col-6"><q-btn color="indigo-7" icon="chat" label="Zalo nhắc gộp" no-caps dense unelevated class="full-width text-weight-bold" @click="sendZaloCombined(item)" /></div>
              <div class="col-6"><q-btn color="teal-7" icon="sms" label="SMS nhắc gộp" no-caps dense unelevated class="full-width text-weight-bold" :href="generateSmsLink(item)" /></div>
            </div>

            <!-- CHI TIẾT CÁC PHÂN HỆ NGHIỆP VỤ -->
            <div class="bg-white q-pa-sm rounded-borders q-mb-xs shadow-1">
              <div class="text-weight-bold text-purple-8 q-mb-xs row items-center"><q-icon name="medical_services" class="q-mr-xs" /> PHÂN HỆ BẢO HIỂM Y TẾ</div>
              <div><strong>Mã số thẻ BHYT:</strong> <span :class="!item.maSoTheBhyt ? 'text-indigo text-weight-bold' : ''">{{ item.maSoTheBhyt || 'Chờ cấp mã thẻ mới' }}</span></div>
              <div><strong>Thời hạn:</strong> {{ item.bhytTuNgay || 'N/A' }} → {{ item.bhytDenNgay || 'N/A' }}</div>
              <div><strong>Số tiền nộp BHYT:</strong> {{ formatCurrency(item.soTienBhyt) }}</div>
              <div><strong>Tiến độ nộp BHXH:</strong> <q-badge :color="item.theoDoiCoQuanBhxh === 'CHUA_NOP' ? 'orange' : 'teal'" dense>{{ item.theoDoiCoQuanBhxh === 'CHUA_NOP' ? 'Chưa nộp' : 'Đã nộp - Chờ phát sinh' }}</q-badge></div>
            </div>

            <div class="bg-white q-pa-sm rounded-borders q-mb-xs shadow-1">
              <div class="text-weight-bold text-green-9 q-mb-xs row items-center"><q-icon name="trending_up" class="q-mr-xs" /> PHÂN HỆ BẢO HIỂM XÃ HỘI TỰ NGUYỆN</div>
              <div><strong>Thời gian đóng:</strong> {{ item.bhxhTuNgay || 'Chưa tham gia' }} → {{ item.bhxhDenNgay || 'Chưa tham gia' }}</div>
              <div><strong>Số tiền thực nộp BHXH:</strong> {{ formatCurrency(item.soTienBhxh) }}</div>
              <div><strong>Hẹn ngày nhắc đóng:</strong> <span class="text-red text-weight-bold">{{ item.nhacDongBhxh || 'N/A' }}</span></div>
            </div>

            <div class="bg-white q-pa-sm rounded-borders shadow-1">
              <div class="text-weight-bold text-orange-9 q-mb-xs row items-center"><q-icon name="folder_shared" class="q-mr-xs" /> HÀNH CHÍNH & LIÊN HỆ</div>
              <div><strong>Mã hộ GD:</strong> {{ item.maHoGiaDinh || 'N/A' }} | <strong>Mã tờ khai:</strong> {{ item.maToKhaiRieng || 'N/A' }}</div>
              <div><strong>SĐT nộp tiền:</strong> {{ item.sdtDongTien || 'N/A' }} | <strong>SĐT nhận tin:</strong> {{ item.sdtNhacHan || 'N/A' }}</div>
              <div class="q-mt-xs border-top-dash q-pt-xs text-italic text-grey-8">Ghi chú: {{ item.ghiChu || 'Không có.' }}</div>
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
import moment from 'moment'

defineProps({ rows: Array, loading: Boolean })
defineEmits(['edit'])

const $q = useQuasar()
const expandedCards = ref([])

const toggleExpand = (id) => {
  expandedCards.value = expandedCards.value.includes(id) ? expandedCards.value.filter(c => c !== id) : [...expandedCards.value, id]
}

const formatNgaySinh = (dateStr) => dateStr ? moment(dateStr, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ'

const buildCombinedMessage = (item) => {
  let msg = `Kính gửi Ông/Bà ${item.hoTen},\nĐại lý thu bảo hiểm thông báo thời hạn đóng tiền:\n`
  if (item.tinhTrangHanThe === 'CHUA_CO_THE') msg += `- Phân hệ BHYT: Hồ sơ mới đang chờ duyệt cấp thẻ.\n`
  else if (item.bhytDenNgay) msg += `- Thẻ BHYT sẽ hết hạn vào ngày: ${item.bhytDenNgay}.\n`
  if (item.bhxhDenNgay) msg += `- BHXH tự nguyện đến hạn đóng kỳ tiếp theo ngày: ${item.bhxhDenNgay}.\n`
  msg += `Kính mong Ông/Bà chủ động liên hệ Nhân viên thu để đóng tiền liên tục. Trân trọng!`
  return msg
}

const generateSmsLink = (item) => `sms:${item.sdtNhacHan || item.soDienThoai || ''}?body=${encodeURIComponent(buildCombinedMessage(item))}`

const sendZaloCombined = (item) => {
  const phone = item.sdtNhacHan || item.soDienThoai || ''
  copyToClipboard(buildCombinedMessage(item)).then(() => {
    $q.notify({ color: 'indigo', icon: 'content_copy', message: 'Đã sao chép tin nhắn gộp! Hãy dán vào Zalo.' })
    setTimeout(() => { window.open(`https://zalo.me{phone}`, '_blank') }, 800)
  })
}

const getBadgeColor = (val) => val === 'CON_HAN' ? 'positive' : (val === 'SAP_HET_HAN' ? 'warning' : (val === 'CHUA_CO_THE' ? 'indigo-7' : 'negative'))
const getStatusLabel = (val) => val === 'CON_HAN' ? 'Còn hạn' : (val === 'SAP_HET_HAN' ? 'Sắp hết hạn' : (val === 'CHUA_CO_THE' ? 'Mới tham gia' : 'Quá hạn'))
</script>

<style scoped>
.mobile-card { border-radius: 8px; overflow: hidden; }
.border-top { border-top: 1px solid #e0e0e0; }
.border-top-dash { border-top: 1px dashed #bdbdbd; }
.full-width { width: 100%; }
.font-10 { font-size: 10px; padding: 2px 4px; }
</style>

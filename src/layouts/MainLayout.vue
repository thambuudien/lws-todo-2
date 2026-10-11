<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <!-- THANH CÔNG CỤ PHÍA TRÊN (HEADER) TỐI ƯU DI ĐỘNG -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-py-xs">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-subtitle1 text-weight-bold row items-center no-wrap">
          <q-icon name="shield" size="24px" class="q-mr-xs text-lime-11" />
          Đại Lý Thu BHYT & BHXH
        </q-toolbar-title>

        <!-- Div hiển thị ngày hiện tại bằng Tiếng Việt dựa trên Moment Boot -->
        <div class="q-mr-sm text-caption text-weight-medium gt-xs">
          {{ thoiGianHienTai }}
        </div>

        <!-- NÚT ĐĂNG XUẤT NHANH -->
        <q-btn
          flat
          round
          dense
          icon="power_settings_new"
          color="lime-11"
          @click="confirmLogout"
        >
          <q-tooltip>Đăng xuất an toàn</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- THANH TRÌNH ĐƠN SIDEBAR RÚT GỌN -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      class="bg-grey-1"
    >
      <q-list>
        <!-- Banner thông tin định danh nhân sự di động -->
        <q-item class="bg-blue-grey-10 text-white q-py-lg q-mb-sm flex flex-center text-center">
          <q-item-section>
            <q-avatar size="56px" color="primary" text-color="white" icon="engineering" class="q-mb-sm shadow-2" />
            <div class="text-subtitle1 text-weight-bold">NHÂN VIÊN THU</div>
            <div class="text-caption text-grey-4 italic">Cổng hotham.vn - PWA App</div>
          </q-item-section>
        </q-item>

        <q-item-label header class="text-grey-7 text-weight-bold text-caption q-pb-xs">
          DANH MỤC NGHIỆP VỤ
        </q-item-label>

        <!-- Menu 1: Trang quản lý tái tục gộp -->
        <q-item
          clickable
          v-ripple
          :active="$route.name === 'dashboard'"
          active-class="bg-indigo-1 text-primary text-weight-bold"
          @click="navigateTo('dashboard')"
        >
          <q-item-section avatar>
            <q-icon name="assignment_ind" :color="$route.name === 'dashboard' ? 'primary' : 'grey-7'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Danh sách tái tục</q-item-label>
            <q-item-label caption class="text-grey-6 text-caption">Quản lý gộp 29 trường</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <!-- THÔNG TIN PHIÊN BẢN VÀ TRẠNG THÁI MẠNG -->
        <div class="q-pa-md text-center text-caption text-grey-6 absolute-bottom bg-grey-2 border-top">
          <div class="row items-center justify-center q-gutter-x-xs q-mb-xs">
            <q-badge :color="isOnline ? 'positive' : 'negative'" dot class="q-mr-xs" />
            <span>Trạng thái: {{ isOnline ? 'Đang trực tuyến' : 'Đang ngoại tuyến (Offline)' }}</span>
          </div>
          <div>Cập nhật CCCD 12 số v1.2.0</div>
        </div>
      </q-list>
    </q-drawer>

    <!-- KHU VỰC CHỨA NỘI DUNG VIEW PWA -->
    <q-page-container>
      <!-- Tối ưu hiệu ứng chuyển trang mượt mà trên Mobile -->
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { apolloClient } from 'src/boot/apollo'
import moment from 'moment'

const router = useRouter()
const $q = useQuasar()

const leftDrawerOpen = ref(false)
const isOnline = ref(navigator.onLine)

// Đọc thời gian thực tế Tiếng Việt từ Moment Boot toàn cục
const thoiGianHienTai = computed(() => {
  return moment().format('dddd, DD/MM/YYYY')
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

// Theo dõi trạng thái mạng cục bộ để hỗ trợ cảnh báo Offline PWA
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
  if (!navigator.onLine) {
    $q.notify({
      color: 'negative',
      message: 'Thiết bị mất kết nối mạng. Ứng dụng tự động chuyển sang cơ chế Offline Cache!',
      icon: 'wifi_off',
      position: 'bottom-right'
    })
  } else {
    $q.notify({
      color: 'positive',
      message: 'Đã khôi phục kết nối trực tuyến. Sẵn sàng đồng bộ dữ liệu mới!',
      icon: 'wifi',
      position: 'bottom-right',
      timeout: 1500
    })
  }
}

// HIỂN THỊ POPUP XÁC NHẬN THOÁT NGHIỆP VỤ
const confirmLogout = () => {
  $q.dialog({
    title: 'Xác nhận đăng xuất',
    message: 'Bạn có chắc chắn muốn thoát khỏi phiên làm việc đại lý thu hiện tại không?',
    cancel: {
      label: 'Hủy bỏ',
      flat: true,
      color: 'grey-7'
    },
    ok: {
      label: 'Thoát hệ thống',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(() => {
    executeLogout()
  })
}

// XỬ LÝ ĐĂNG XUẤT THUẦN QUA LOCALSTORAGE & APOLO CACHE
const executeLogout = () => {
  // 1. Dọn dẹp token kết nối để ngắt quyền truy cập authLink
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')

  // 2. Clear store cache Apollo để ngăn rò rỉ thông tin dữ liệu của nhân viên cũ
  apolloClient.clearStore()

  // 3. Đẩy thẳng giao diện ra màn Login độc lập
  router.push({ name: 'login' })

  $q.notify({
    color: 'positive',
    message: 'Đã đăng xuất hệ thống an toàn.',
    icon: 'logout',
    timeout: 1000
  })
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}
.font-weight-bold {
  font-weight: 700;
}
.opacity-80 {
  opacity: 0.8;
}
.opacity-40 {
  opacity: 0.4;
}
/* Hiệu ứng chuyển trang mượt mà không bị khựng trên Mobile */
.animated {
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
.fadeIn { animation-name: fadeIn; }
.fadeOut { animation-name: fadeOut; }
</style>

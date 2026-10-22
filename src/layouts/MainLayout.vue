<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <!-- THANH CÔNG CỤ PHÍA TRÊN (HEADER) -->
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

        <q-toolbar-title
          class="text-subtitle1 text-weight-bold row items-center no-wrap"
        >
          <q-icon name="shield" size="24px" class="q-mr-xs text-lime-11" />
          Quản Lý Tái Tục BHYT
        </q-toolbar-title>

        <!-- HIỂN THỊ TÊN NHÂN VIÊN THU TRÊN THANH HEADER -->
        <div
          class="q-mr-md text-caption text-weight-bold text-lime-11 gt-xs row items-center"
        >
          <q-icon name="account_circle" size="16px" class="q-mr-xs" />
          {{ tenNhanVien }}
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
      :width="280"
      class="bg-grey-1"
    >
      <q-list>
        <!-- KHU VỰC HIỂN THỊ THÔNG TIN ĐỊNH DANH NHÂN VIÊN THU -->
        <q-item
          class="bg-blue-grey-10 text-white q-py-lg q-mb-sm flex flex-center text-center"
        >
          <q-item-section>
            <q-avatar
              size="48px"
              color="primary"
              text-color="white"
              icon="person"
              class="q-mb-sm shadow-2"
            />
            <!-- Hiển thị tên nhân viên lấy trực tiếp từ localStorage -->
            <div class="text-subtitle1 text-weight-bold text-uppercase">
              {{ tenNhanVien }}({{ databaseId }})
            </div>
            <div class="text-caption text-grey-4 italic">
              {{ email }}
            </div>
          </q-item-section>
        </q-item>

        <q-item-label
          header
          class="text-grey-7 text-weight-bold text-caption q-pb-xs"
        >
          DANH MỤC NGHIỆP VỤ
        </q-item-label>

        <q-item
          clickable
          v-ripple
          :active="$route.name === 'dashboard'"
          active-class="bg-indigo-1 text-primary text-weight-bold"
          @click="navigateTo('dashboard')"
        >
          <q-item-section avatar>
            <q-icon
              name="assignment_ind"
              :color="$route.name === 'dashboard' ? 'primary' : 'grey-7'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>Danh sách tái tục</q-item-label>
            <q-item-label caption class="text-grey-6 text-caption"
              >Quản lý gộp 29 trường</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- BỘ CÔNG CỤ MỚI -->
        <q-item-label
          header
          class="text-grey-8 text-weight-bold text-caption q-pb-none q-pt-none"
        >
          📊 BỘ CÔNG CỤ TÍNH BHXH & BHYT - LONG WEB STUDIO
        </q-item-label>

        <q-item dense>
          <q-item-section>
            <q-item-label caption class="text-grey-8 text-caption">
              🤖 Cộng đồng số hóa quy trình tư vấn an sinh xã hội từ Freelancer
              Long Web Studio!
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label
          header
          class="text-caption text-weight-medium q-pt-sm q-pb-none"
        >
          🛠️ TRỌN BỘ TOOL MIỄN PHÍ:
        </q-item-label>

        <q-item
          clickable
          dense
          v-ripple
          @click="openLink('https://www.longwebstudio.io.vn/tinh-bhxh-tu-nguyen')"
        >
          <q-item-section avatar>
            <q-icon name="calculate" color="green-7" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-12 text-weight-medium"
              >BHXH Tự Nguyện</q-item-label
            >
            <q-item-label caption class="font-11"
              >Tính phí đóng & dự tính lương hưu</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item
          clickable
          dense
          v-ripple
          @click="
            openLink('https://www.longwebstudio.io.vn/tinh-bhyt-ho-gia-dinh')
          "
        >
          <q-item-section avatar>
            <q-icon name="family_restroom" color="blue-7" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-12 text-weight-medium"
              >BHYT Hộ Gia Đình</q-item-label
            >
            <q-item-label caption class="font-11"
              >Tính giảm trừ & tạo mã VietQR</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item
          clickable
          dense
          v-ripple
          @click="openLink('https://sothu.longwebstudio.io.vn/')"
        >
          <q-item-section avatar>
            <q-icon name="event_note" color="orange-7" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-12 text-weight-medium"
              >Sổ Thu Bảo Hiểm Online</q-item-label
            >
            <q-item-label caption class="font-11"
              >Nhắc lịch hạn đóng tự động</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item-label
          header
          class="text-caption text-weight-medium q-pt-sm q-pb-none"
        >
          🔥 QUYỀN LỢI THÀNH VIÊN:
        </q-item-label>

        <q-item dense>
          <q-item-section>
            <q-item-label caption class="font-11"
              >💬 Nhận kịch bản nhắn tin Zalo 1-Click và bài đăng Facebook thu hút
              người dân.</q-item-label
            >
            <q-item-label caption class="font-11"
              >📈 Chia sẻ kinh nghiệm thực chiến đi thị trường, chốt sổ/thẻ nhanh
              cấp xã/phường.</q-item-label
            >
            <q-item-label caption class="font-11"
              >💻 Cập nhật liên tục các tính năng số chuyên nghiệp độc
              quyền.</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item
          clickable
          dense
          v-ripple
          @click="openLink('https://zalo.me/g/lpinyffjkeqrre2jpr9t')"
        >
          <q-item-section avatar>
            <q-icon name="groups" color="blue-8" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-12 text-weight-medium"
              >Tham gia cộng đồng Zalo</q-item-label
            >
            <q-item-label caption class="font-11"
              >Hỏi đáp & chia sẻ kinh nghiệm</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item-label
          header
          class="text-caption text-weight-medium q-pt-sm q-pb-none"
        >
          ⚠️ Quy tắc:
        </q-item-label>
        <q-item dense>
          <q-item-section>
            <q-item-label caption class="font-11"
              >Chỉ thảo luận chuyên môn, không quảng cáo ngoài lề, không
              spam.</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <div
          class="q-pa-md text-center text-caption text-grey-6 absolute-bottom bg-grey-2 border-top"
        >
          <div class="row items-center justify-center q-gutter-x-xs q-mb-xs">
            <q-badge
              :color="isOnline ? 'positive' : 'negative'"
              dot
              class="q-mr-xs"
            />
            <span
              >Trạng thái:
              {{ isOnline ? "Trực tuyến" : "Ngoại tuyến (Offline)" }}</span
            >
          </div>
          <div>Cập nhật CCCD 12 số v1.2.0</div>
        </div>
      </q-list>
    </q-drawer>

    <!-- KHU VỰC CHỨA NỘI DUNG VIEW PWA -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { apolloClient } from "src/boot/apollo";

const router = useRouter();
const $q = useQuasar();

const leftDrawerOpen = ref(false);
const isOnline = ref(navigator.onLine);

const userDangNhap = ref({
  name: "",
  databaseId: 0,
  email: "",
});

const tenNhanVien = computed(() => userDangNhap.value.name);
const databaseId = computed(() => userDangNhap.value.databaseId);
const email = computed(() => userDangNhap.value.email);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const navigateTo = (routeName) => {
  router.push({ name: routeName });
};
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

const openLink = (url) => {
  window.open(url, "_blank");
};

const confirmLogout = () => {
  $q.dialog({
    title: "Xác nhận đăng xuất",
    message: "Bạn có chắc chắn muốn thoát khỏi phiên làm việc hiện tại không?",
    cancel: { label: "Hủy bỏ", flat: true, color: "grey-7" },
    ok: { label: "Thoát hệ thống", color: "negative", unelevated: true },
    persistent: true,
  }).onOk(() => {
    // Xóa sạch bộ nhớ khi thoát
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("user");
    router.push({ name: "login" });
  });
};

onMounted(() => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  userDangNhap.value = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    databaseId: 0,
    email: "",
  };
});

onBeforeUnmount(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
});
</script>

<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}
.text-lime-11 {
  color: #cddc39;
}
.animated {
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.fadeIn {
  animation-name: fadeIn;
}
.fadeOut {
  animation-name: fadeOut;
}
.font-11 {
  font-size: 11px;
  line-height: 1.3;
}
.font-12 {
  font-size: 12.5px;
}
</style>

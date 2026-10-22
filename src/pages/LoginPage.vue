<template>
  <q-page class="bg-grey-1 flex flex-center q-pa-md">
    <div
      class="row shadow-2 rounded-borders overflow-hidden"
      style="
        width: 100%;
        max-width: 950px;
        min-height: 650px;
        background: white;
      "
    >
      <!-- CỘT TRÁI: BÁN NIỀM TIN -->
      <div
        class="col-md-5 col-12 bg-primary q-pa-xl flex column justify-between gt-sm"
        style="background: linear-gradient(165deg, #0e7490 0%, #083344 100%)"
      >
        <div>
          <div class="row items-center q-mb-xl">
            <q-icon name="verified_user" color="white" size="28px" />
            <div class="text-white text-weight-bold q-ml-sm">
              ANLO - SỔ THU BẢO HIỂM
            </div>
          </div>
          <div
            class="text-h4 text-white text-weight-bold"
            style="line-height: 1.2"
          >
            Nhắc tái tục<br />không sót 1 ai
          </div>
          <!-- ĐÃ SỬA THEO YÊU CẦU CỦA BẠN -->
          <div
            class="text-white q-mt-md"
            style="opacity: 0.9; line-height: 1.5"
          >
            Lọc khách hàng cần gia hạn thẻ BHYT, đóng tiếp BHXH tự nguyện trong
            tháng này.
          </div>

          <!-- DANH SÁCH NHIỀU KHÁCH - TĂNG FOMO -->
          <q-card flat class="q-mt-xl bg-white q-pa-md rounded-borders">
            <div class="row justify-between items-center">
              <div class="text-caption text-grey-7">KHÁCH CẦN NHẮC HÔM NAY</div>
              <q-badge color="red" :label="soKhachSapHetHan + ' khách'" />
            </div>

            <q-list dense class="q-mt-sm">
              <q-item class="q-px-none">
                <q-item-section avatar
                  ><q-avatar size="32px" color="orange-1" text-color="orange"
                    >L</q-avatar
                  ></q-item-section
                >
                <q-item-section>
                  <q-item-label class="text-weight-bold"
                    >Nguyễn Thị Lan - Thôn 3</q-item-label
                  >
                  <q-item-label caption class="text-red"
                    >BHYT hộ GĐ hết hạn {{ ngayHienTai }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side
                  ><q-icon name="chevron_right"
                /></q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item class="q-px-none">
                <q-item-section avatar
                  ><q-avatar size="32px" color="blue-1" text-color="blue"
                    >H</q-avatar
                  ></q-item-section
                >
                <q-item-section>
                  <q-item-label class="text-weight-bold"
                    >Trần Văn Hùng</q-item-label
                  >
                  <q-item-label caption
                    >BHXH tự nguyện đến kỳ 12 tháng</q-item-label
                  >
                </q-item-section>
                <q-item-section side
                  ><q-badge color="orange" label="BHXH"
                /></q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item class="q-px-none">
                <q-item-section avatar
                  ><q-avatar size="32px" color="green-1" text-color="green"
                    >M</q-avatar
                  ></q-item-section
                >
                <q-item-section>
                  <q-item-label class="text-weight-bold"
                    >Hộ Bà Mai - 4 nhân khẩu</q-item-label
                  >
                  <q-item-label caption
                    >BHYT hộ gia đình - Còn 3 ngày</q-item-label
                  >
                </q-item-section>
                <q-item-section side
                  ><q-badge color="green" label="4 người"
                /></q-item-section>
              </q-item>

              <q-item class="q-px-none q-mt-sm">
                <q-item-section>
                  <div class="text-caption text-grey-6 text-center">
                    + {{ soKhachSapHetHan - 3 }} khách khác đang chờ...
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn
              unelevated
              color="primary"
              label="Xem tất cả & Gửi Zalo hàng loạt"
              class="full-width q-mt-md"
              size="sm"
              no-caps
            />
          </q-card>
        </div>
        <div class="text-white" style="opacity: 0.6; font-size: 11px">
          Hỗ trợ: <a href="tel:0966570913" class="text-white">0966 570 913</a> |
          <a
            href="https://fb.com/sothubaohiem"
            target="_blank"
            class="text-white"
            >fb.com/sothubaohiem</a
          >
        </div>
      </div>

      <!-- CỘT PHẢI -->
      <div class="col-md-7 col-12 flex flex-center q-pa-lg">
        <div style="width: 100%; max-width: 380px">
          <div class="text-h5 text-weight-bold">Đăng nhập Sổ Thu</div>
          <div class="text-grey-7 q-mt-xs q-mb-lg">
            Dành cho nhân viên thu BHXH, BHYT
          </div>

          <q-banner
            v-if="errorMsg"
            class="bg-red-1 text-red-9 q-mb-md rounded-borders"
            dense
          >
            <template v-slot:avatar><q-icon name="warning" /></template>
            {{ errorMsg }}
          </q-banner>

          <q-btn
            label="Tiếp tục với Google"
            @click="handleGoogleLogin"
            unelevated
            class="full-width"
            size="lg"
            no-caps
            :loading="firebaseLoading"
            style="
              background: white;
              color: #3c4043;
              border: 1px solid #dadce0;
              font-weight: 500;
            "
            icon="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          />

          <div class="row items-center q-my-lg">
            <q-separator class="col" />
            <div class="q-mx-md text-caption text-grey-6">
              HOẶC BẰNG EMAIL/SĐT
            </div>
            <q-separator class="col" />
          </div>

          <q-form @submit.prevent="submitForm" class="q-gutter-y-md">
            <div>
              <div class="text-weight-medium q-mb-xs">
                Email hoặc Số điện thoại thu <span class="text-red">*</span>
              </div>
              <q-input
                v-model="formData.username"
                placeholder="VD: 0374638603 hoặc email"
                outlined
                required
                dense
              >
                <template v-slot:prepend><q-icon name="person" /></template>
              </q-input>
            </div>

            <div>
              <div class="row justify-between q-mb-xs">
                <div class="text-weight-medium">Mật khẩu</div>
                <a
                  class="text-primary text-caption cursor-pointer"
                  @click="forgotPassword"
                  >Quên mật khẩu?</a
                >
              </div>
              <q-input
                v-model="formData.password"
                :type="isPwd ? 'password' : 'text'"
                placeholder="Nhập mật khẩu"
                outlined
                required
                dense
              >
                <template v-slot:prepend><q-icon name="lock" /></template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <q-btn
              label="Xem khách cần nhắc tái tục"
              type="submit"
              color="primary"
              unelevated
              class="full-width q-mt-sm"
              size="lg"
              :loading="loading"
              no-caps
            />
          </q-form>

          <div class="text-center q-mt-lg text-caption text-grey-7">
            Bằng việc đăng nhập, bạn đồng ý với
            <span class="text-primary">Điều khoản Anlo</span><br />
            Hỗ trợ: <a href="tel:0966570913">0966 570 913</a> |
            <a href="https://fb.com/sothubaohiem" target="_blank"
              >fb.com/sothubaohiem</a
            ><br />
            Mã thu: {{ previewMaThu }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { signInWithGoogle } from "src/boot/firebase";
import { LOGIN_USER, LOGIN_WITH_FIREBASE } from "src/mutations/login-user";
import moment from "moment";

export default {
  name: "PageAuthThuTaiTucV2",
  setup() {
    const router = useRouter();
    const errorMsg = ref("");
    const isPwd = ref(true);
    const firebaseLoading = ref(false);
    const previewMaThu = ref("0374638603");
    const soKhachSapHetHan = ref(8);
    const formData = ref({ username: "", password: "" });

    // Fix lỗi moment trong template
    const ngayHienTai = computed(() => moment().add(5, "days").format("DD/MM"));

    const { mutate: login, loading } = useMutation(LOGIN_USER, () => ({
      variables: {
        username: formData.value.username.trim(),
        password: formData.value.password,
      },
    }));
    const { mutate: loginWithFirebase } = useMutation(LOGIN_WITH_FIREBASE);

    const submitForm = async () => {
      errorMsg.value = "";
      try {
        const result = await login();
        const { authToken, refreshToken, user } = result.data.login;
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/"); // Marketing: Vào là thấy khách cần nhắc
      } catch (e) {
        const msg = e.message?.toLowerCase() || "";
        if (msg.includes("not found") || msg.includes("user")) {
          errorMsg.value =
            "SĐT/Email này chưa có mã thu. Gọi 0966 570 913 để cấp mã.";
        } else if (msg.includes("password")) {
          errorMsg.value = "Sai mật khẩu rồi. Bấm Quên mật khẩu nhé.";
        } else {
          errorMsg.value = e.message || "Lỗi mạng, thử lại nhé.";
        }
      }
    };

    const handleGoogleLogin = async () => {
      errorMsg.value = "";
      firebaseLoading.value = true;
      try {
        const fbUser = await signInWithGoogle();
        if (!fbUser?.email) throw new Error("Không lấy được email từ Google.");
        const idToken = await fbUser.getIdToken();
        const { data } = await loginWithFirebase({ idToken });
        const { authToken, refreshToken, user } = data.loginWithFirebase;
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/");
      } catch (err) {
        if (err.code === "auth/popup-closed-by-user")
          errorMsg.value = "Bạn đã đóng cửa sổ Google.";
        else if (err.code === "auth/unauthorized-domain")
          errorMsg.value = `Tên miền ${window.location.hostname} chưa được cấp phép trong Firebase.`;
        else errorMsg.value = err.message || "Đăng nhập Google thất bại.";
      } finally {
        firebaseLoading.value = false;
      }
    };

    const forgotPassword = () => router.push("/quen-mat-khau"); // Fix: Đừng đẩy ra ngoài longwebstudio.io.vn

    return {
      formData,
      submitForm,
      loading,
      firebaseLoading,
      handleGoogleLogin,
      errorMsg,
      isPwd,
      previewMaThu,
      forgotPassword,
      ngayHienTai,
      soKhachSapHetHan,
    };
  },
};
</script>

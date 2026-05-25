<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md" style="width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Đăng nhập</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="login">
              <q-input
                v-model="username"
                label="Tên đăng nhập"
                filled
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Vui lòng nhập tên đăng nhập']"
              />

              <q-input
                v-model="password"
                type="password"
                label="Mật khẩu"
                filled
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Vui lòng nhập mật khẩu']"
              />

              <q-banner v-if="error" inline-actions class="text-white bg-red q-mt-md">
                Đã xảy ra lỗi: {{ error.message }}
              </q-banner>

              <div class="q-mt-md">
                <q-btn
                  label="Đăng nhập"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { clientMutationId: "uniqueId", username: $username, password: $password }) {
      authToken
      user {
        id
        name
      }
    }
  }
`;

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const { mutate: login, loading, error, onDone } = useMutation(LOGIN_MUTATION, () => ({
      variables: {
        username: username.value,
        password: password.value,
      },
    }));

    onDone(result => {
      const authToken = result.data.login.authToken;
      localStorage.setItem('authToken', authToken);
      // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
      router.push('/');
    });

    return {
      username,
      password,
      login,
      loading,
      error
    };
  }
});
</script>

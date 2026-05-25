<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Quản lý Tái tục BHYT/BHXH</q-toolbar-title>

        <q-btn flat round dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Chức năng</q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useRouter } from 'vue-router';

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Tổng quan',
    icon: 'dashboard',
    link: '#/',
  },
  {
    title: 'Khách hàng',
    caption: 'Quản lý khách hàng',
    icon: 'people',
    link: '#/customers',
  },
  {
    title: 'Hợp đồng',
    caption: 'Quản lý hợp đồng',
    icon: 'assignment',
    link: '#/policies',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem('authToken');
      router.push('/login');
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
    };
  },
});
</script>

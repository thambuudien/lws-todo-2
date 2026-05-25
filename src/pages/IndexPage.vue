<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Dashboard</div>
    <div class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Hợp đồng sắp hết hạn</div>
          <p>Danh sách các hợp đồng BHYT/BHXH sẽ hết hạn trong 30 ngày tới.</p>
          <!-- Danh sách sẽ được hiển thị ở đây -->
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Thống kê nhanh</div>
          <!-- Các số liệu thống kê sẽ được hiển thị ở đây -->
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
});
</script>

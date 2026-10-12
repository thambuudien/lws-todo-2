<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="row q-col-gutter-sm items-center">
      <!-- Ô nhập từ khóa tự động tìm kiếm hỗn hợp ngay khi gõ -->
      <div class="col-12 col-sm-6">
        <q-input
          filled
          dense
          clearable
          v-model="searchText"
          placeholder="Gõ họ tên, số điện thoại, hoặc số CCCD để tìm ngay..."
          @update:model-value="emitFilters"
          @clear="onClearSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- Ô CHECKBOX LỌC KẾT HỢP CHIẾN DỊCH THEO PHÂN HỆ BHXH -->
      <div class="col-12 col-sm-3 row items-center">
        <q-checkbox
          v-model="onlyBhxh"
          label="Chỉ tham gia BHXH tự nguyện"
          color="green-8"
          keep-color
          class="text-weight-medium text-grey-9 text-caption"
          @update:model-value="emitFilters"
        />
      </div>

      <!-- Nút thêm mới / đồng bộ -->
      <div class="col-12 col-sm-3 text-right">
        <q-btn
          color="primary"
          icon="add"
          label="Thêm mới / Đồng bộ"
          no-caps
          class="full-width"
          @click="$emit('addNew')"
          unelevated
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["search", "addNew"]);

const searchText = ref("");
const onlyBhxh = ref(false);

// Phát gộp đồng thời cả từ khóa gõ text và trạng thái Checkbox về tệp cha IndexPage
const emitFilters = () => {
  emit("search", {
    text: searchText.value || "",
    onlyBhxh: onlyBhxh.value,
  });
};

const onClearSearch = () => {
  searchText.value = "";
  emitFilters();
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>

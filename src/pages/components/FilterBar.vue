<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="row q-col-gutter-sm items-center">
      <!-- Chế độ tìm kiếm -->
      <div class="col-12 col-sm-3">
        <q-btn-toggle
          v-model="searchMode"
          spread
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="grey-3"
          text-color="grey-7"
          :options="[{ label: 'Mã số / CCCD', value: 'exact' }, { label: 'Tìm hỗn hợp', value: 'mixed'} ]"
          @update:model-value="onModeChange"
        />
      </div>

      <!-- Ô nhập từ khóa tự động tìm kiếm ngay khi gõ -->
      <div class="col-12 col-sm-6">
        <q-input
          filled
          dense
          clearable
          v-model="searchText"
          :placeholder="
            searchMode === 'exact'
              ? 'Gõ đến đâu tìm đến đó (12 số CCCD)...'
              : 'Gõ tên, SĐT, hoặc từ khóa để tìm ngay...'
          "
          :mask="searchMode === 'exact' ? '############' : ''"
          @update:model-value="onTextChange"
        >
          <template v-slot:append>
            <q-icon name="keyboard" class="text-grey-5" />
          </template>
        </q-input>
      </div>

      <!-- Nút thêm mới -->
      <div class="col-12 col-sm-3 text-right">
        <q-btn
          color="primary"
          icon="add"
          label="Thêm mới / Đồng bộ"
          no-caps
          class="full-width"
          @click="$emit('addNew')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["search", "addNew"]);

const searchMode = ref("exact");
const searchText = ref("");

const onModeChange = () => {
  searchText.value = "";
  emit("search", { mode: searchMode.value, text: "" });
};

// Bắn dữ liệu liên tục về file cha ngay khi người dùng gõ chữ hoặc xóa chữ
const onTextChange = (value) => {
  emit("search", { mode: searchMode.value, text: value || "" });
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>

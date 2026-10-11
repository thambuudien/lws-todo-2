<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="row q-col-gutter-md items-center">
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
          :options="[
            { label: 'Mã số / CCCD', value: 'exact' },
            { label: 'Tìm hỗn hợp', value: 'mixed' },
          ]"
          @update:model-value="onModeChange"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          filled
          dense
          clearable
          v-model="searchText"
          :placeholder="
            searchMode === 'exact'
              ? 'Nhập chính xác 12 số CCCD...'
              : 'Nhập Tên, SĐT, hoặc từ khóa...'
          "
          :mask="searchMode === 'exact' ? '############' : ''"
          @keyup.enter="triggerSearch"
        >
          <template v-slot:append>
            <q-btn round flat icon="search" @click="triggerSearch" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3 text-right">
        <q-btn
          color="primary"
          icon="add"
          label="Thêm mới / Đồng bộ"
          no-caps
          class="full-width-xs"
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
  triggerSearch();
};

const triggerSearch = () => {
  emit("search", { mode: searchMode.value, text: searchText.value });
};
</script>

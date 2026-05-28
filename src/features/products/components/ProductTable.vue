<script setup lang="ts">
import { useCompare } from "../composables/useCompare";
import { useFavorites } from "../composables/useFavorites";
import { toolbarConfig } from "../constants/toolbarOptions";

import type { Product } from "@/features/products/types";
import Icon from "@/shared/components/icons/Icon.vue";
import { VCheckbox, VToolbar, VTable } from "@/shared/components/index";
import { firstLetterUp } from "@/shared/utils/firstLetterUp";

interface ProductTableProps {
  rows: Product[];
  isLoading: boolean;
  hasMore: boolean;
  limit: number;
}

const { rows, isLoading, hasMore, limit } = defineProps<ProductTableProps>();

const emit = defineEmits<{
  request: [params: { limit: number }];
  "reset-filters": [void];
}>();

const searchQuery = defineModel<string>("searchQuery");
const toolbar = defineModel<any>("toolbar");

const { isProductSaved, toggleSaveProduct } = useFavorites();
const { isInCompare, toggleCompare } = useCompare();

const productsHeader = [
  { key: "thumbnail", label: "Image", width: "100px" },
  { key: "title", label: "Title", width: "1fr" },
  { key: "brand", label: "Brand", width: "1fr" },
  { key: "category", label: "Category", width: "1fr" },
  { key: "price", label: "Price, $", width: "100px" },
  { key: "rating", label: "Rating", width: "100px" },
  { key: "stock", label: "Stock", width: "100px" },
  { key: "compare", label: "Compare", width: "100px" },
];

const resetFilters = () => emit("reset-filters");

const handleRequest = (params: { limit: number }) => emit("request", params);
</script>

<template>
  <div class="table-container">
    <VTable
      :header="productsHeader"
      :rows="rows"
      :searchable="true"
      :show-filters="true"
      :loader="isLoading"
      :has-more="hasMore"
      :limit="limit"
      @request="handleRequest"
    >
      <template #toolBar>
        <VToolbar
          v-model:search="searchQuery"
          v-model:filters="toolbar"
          :filter-configs="toolbarConfig"
          select-width="md"
          placeholder="Search by title, category or brand"
          @reset-filters="resetFilters"
        />
      </template>
      <template #col-thumbnail="{ row }">
        <div class="thumbnail-cell">
          <img
            :src="row.thumbnail"
            :alt="row.title"
            class="product-image"
          >
          <VCheckbox
            :model-value="isProductSaved(row.id)"
            @update:model-value="
              (val) => toggleSaveProduct(val, row as Product)
            "
          >
            <template #box>
              <Icon :filled="isProductSaved(row.id)" />
            </template>
          </VCheckbox>
        </div>
      </template>
      <template #col-title="{ row }">
        <p class="product-title">
          {{ row.title }}
        </p>
      </template>
      <template #col-brand="{ row }">
        <p
          v-if="row.brand"
          class="product-brand"
        >
          {{ row.brand }}
        </p>
        <p v-else>
          —
        </p>
      </template>
      <template #col-category="{ row }">
        <p class="product-category">
          {{ firstLetterUp(row.category) }}
        </p>
      </template>
      <template #col-price="{ row }">
        <p class="product-price">
          {{ row.price }}
        </p>
      </template>
      <template #col-rating="{ row }">
        <p class="product-rating">
          {{ row.rating }}
        </p>
      </template>
      <template #col-stock="{ row }">
        <p class="product-stock">
          {{ row.stock }}
        </p>
      </template>
      <template #col-compare="{ row }">
        <VCheckbox
          variant="custom"
          :model-value="isInCompare(row.id)"
          @update:model-value="() => toggleCompare(row as Product)"
        />
      </template>
    </VTable>
  </div>
</template>

<style scoped>
.table-container {
  margin: 24px;
  box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

:deep(.v-table-container) {
  padding: 0;
  background-color: transparent;
  height: calc(100vh - 100px);
}

:deep(.v-table-wrapper) {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-table-header-cell) {
  padding: 16px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.v-table-row:hover) {
  background-color: #fff;
}

.thumbnail-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.product-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-brand,
.product-category {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-brand {
  color: #475569;
}

.product-category {
  color: #2563eb;
}

.product-price {
  font-weight: 600;
  color: #059669;
  font-size: 15px;
}

.product-rating {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #b45309;
}

.product-rating::before {
  color: #f59e0b;
}

.product-stock {
  font-weight: 500;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}
</style>

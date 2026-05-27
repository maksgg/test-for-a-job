<script setup lang="ts">
import { useCompare } from "../composables/useCompare";
import { useFavorites } from "../composables/useFavorites";
import { toolbarConfig } from "../constants/toolbarOptions";

import type { Product } from "@/features/products/types";
import VCheckbox from "@/shared/components/VCheckbox.vue";
import VToolbar from "@/shared/components/VToolbar.vue";
import Icon from "@/shared/components/icons/Icon.vue";
import VTable from "@/shared/components/table/VTable.vue";
import { firstLetterUp } from "@/shared/utils/firstLetterUp";

interface ProductTableProps {
  rows: Product[];
  isLoading: boolean;
  hasMore: boolean;
  limit: number;
}

const props = defineProps<ProductTableProps>();

const emit = defineEmits<{
  request: [params: { limit: number }];
  "reset-filters": [void];
}>();

const searchQuery = defineModel<string>("searchQuery");
const toolbar = defineModel<any>("toolbar");

// Локалізована логіка дій всередині таблиці
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
      :rows="props.rows"
      :searchable="true"
      :show-filters="true"
      :loader="props.isLoading"
      :has-more="props.hasMore"
      :limit="props.limit"
      @request="handleRequest"
    >
      <template #toolBar>
        <VToolbar
          v-model:search="searchQuery"
          v-model:filters="toolbar"
          :filter-configs="toolbarConfig"
          select-width="md"
          placeholder="Search by..."
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
  height: calc(100vh - 280px);
  box-sizing: border-box;
}

:deep(.v-table-sticky-header) {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.v-table-wrapper) {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

/* Header styles */
:deep(.v-table-header) {
  background-color: #f8fafc;
  border-bottom: 2px solid #f1f5f9;
}

:deep(.v-table-header-cell) {
  padding: 16px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Row and Cell styles */
:deep(.v-table-row) {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

:deep(.v-table-row:hover) {
  background-color: #f8fafc;
}

:deep(.v-table-cell) {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: none;
}

/* Product specific styles */
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
  margin: 0;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-brand,
.product-category {
  margin: 0;
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
  margin: 0;
  font-weight: 700;
  color: #059669;
  font-size: 15px;
}

.product-rating {
  margin: 0;
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #b45309;
}

.product-rating::before {
  content: "★";
  margin-right: 4px;
  color: #f59e0b;
}

.product-stock {
  margin: 0;
  font-weight: 500;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

/* Toolbar customization */
:deep(.v-table-toolbar) {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.v-table-toolbar p) {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  font-style: italic;
}
</style>

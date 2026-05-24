<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import useProductsRequest from "./api/useProductsRequest";
import { useCatalogSearch } from "./composables/useCatalogSearch";
import {
  filterProducts,
  sortProducts,
} from "./composables/useCatalogToolbarOptions";

import type { Product } from "@/features/products/types";
import VToolbar from "@/shared/components/VToolbar.vue";
import VTable from "@/shared/components/table/VTable.vue";

const { fetchProducts, isLoading } = useProductsRequest();
const products = ref<Product[]>([]);

const toolbar = ref({
  filter: "category",
  sort: "",
});

const productsHeader = [
  { key: "thumbnail", label: "Image", width: "100px" },
  { key: "title", label: "Title", width: "1fr" },
  { key: "brand", label: "Brand", width: "1fr" },
  { key: "category", label: "Category", width: "1fr" },
  { key: "price", label: "Price, $", width: "100px" },
  { key: "rating", label: "Rating", width: "100px" },
  { key: "stock", label: "Stock", width: "100px" },
];

const toolbarConfig = computed(() => [
  {
    key: "filter",
    label: "Filter by",
    options: [
      { name: "All Products", value: "category" },
      { name: "Only in-stock products", value: "in-stock" },
      { name: "Only discounted products", value: "discounted" },
    ],
  },
  {
    key: "sort",
    label: "Sort by",
    options: [
      { name: "Default", value: "" },
      { name: "Price: low to high", value: "p-low" },
      { name: "Price: high to low", value: "p-high" },
      { name: "Rating: high to low", value: "r-high" },
      { name: "Rating: low to high", value: "r-low" },
      { name: "Title: A-Z", value: "A-Z" },
      { name: "Title: Z-A", value: "Z-A" },
    ],
  },
]);

const toolbarResult = computed(() => {
  const filtered = filterProducts(products.value, toolbar.value.filter);
  return sortProducts(filtered, toolbar.value.sort);
});
const { searchQuery, searchedProducts } = useCatalogSearch(toolbarResult, 300);

onMounted(async () => {
  const result = await fetchProducts();
  if (Array.isArray(result)) {
    products.value = result;
  }
});
</script>

<template>
  <VTable
    :header="productsHeader"
    :rows="searchedProducts"
    :searchable="true"
    :show-filters="true"
    :loader="isLoading"
  >
    <template #toolBar>
      <VToolbar
        v-model:search="searchQuery"
        v-model:filters="toolbar"
        :filter-configs="toolbarConfig"
        placeholder="Search by title, category or brand"
      />
    </template>
    <template #col-thumbnail="{ row }">
      <img :src="row.thumbnail" :alt="row.title" class="product-image" />
    </template>
    <template #col-title="{ row }">
      <p class="product-title">
        {{ row.title }}
      </p>
    </template>
    <template #col-brand="{ row }">
      <p v-if="row.brand" class="product-brand">
        {{ row.brand }}
      </p>
      <p v-else>—</p>
    </template>
    <template #col-category="{ row }">
      <p class="product-category">
        {{ row.category }}
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
  </VTable>
</template>

<style scoped>
:deep(.v-table-container) {
  padding: 24px;
  background-color: #f9fafb;
  height: calc(100vh - 48px); /* Залишаємо місце для зовнішніх відступів */
  box-sizing: border-box;
}

:deep(.v-table-sticky-header) {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.v-table-wrapper) {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
}

.product-brand,
.product-category {
  margin: 0;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.product-brand {
  background-color: #f1f5f9;
  color: #475569;
}

.product-category {
  background-color: #eff6ff;
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

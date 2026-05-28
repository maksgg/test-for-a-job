<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import useProductsRequest from "./api/useProductsRequest";
import { useCatalogSearch } from "./composables/useCatalogSearch";
import {
  filterProducts,
  sortProducts,
} from "./composables/useCatalogToolbarOptions";
import { useCompare } from "./composables/useCompare";
import { useFavorites } from "./composables/useFavorites";

import { Compare, Favorite, ProductCard, ProductTable } from "@/features/products/components/index";
import { toolbarConfig } from "@/features/products/constants/toolbarOptions";
import type { Product } from "@/features/products/types";
import { VButton, VToolbar } from "@/shared/components/index";

const { fetchProducts, isLoading, error } = useProductsRequest();
const products = ref<Product[]>([]);
const totalProducts = ref(0);
const currentLimit = ref(30);

const toolbar = ref({
  filter: "category",
  sort: "",
});

const toolbarResult = computed(() => {
  const filtered = filterProducts(products.value, toolbar.value.filter);
  return sortProducts(filtered, toolbar.value.sort);
});
const { searchQuery, searchedProducts } = useCatalogSearch(toolbarResult, 300);

const { loadSavedProducts, savedProducts, toggleSaveProduct } = useFavorites();
const {
  comparedProducts,
  errorMessage: compareError,
  removeProduct,
  clearCompare,
  loadComparedProducts,
} = useCompare();

const hasMore = computed(() => currentLimit.value < totalProducts.value);

const fetchItems = async (limit: number) => {
  const result = await fetchProducts({ limit });
  if (result && typeof result === "object" && "products" in result) {
    products.value = result.products;
    totalProducts.value = result.total;
    currentLimit.value = limit;
  }
};

const handleRequest = async (params: { limit: number }) => {
  await fetchItems(params.limit);
};

const retryFetch = () => fetchItems(currentLimit.value);

const resetFilters = async () => {
  searchQuery.value = "";
  toolbar.value = {
    filter: "category",
    sort: "",
  };
  currentLimit.value = 30;
  await fetchItems(currentLimit.value);
};

onMounted(async () => {
  loadSavedProducts();
  loadComparedProducts();
  await fetchItems(currentLimit.value);
});
</script>

<template>
  <div class="products-container">
    <div
      v-if="error"
      class="error-banner"
    >
      <p>{{ error }}</p>
      <button
        class="retry-button"
        @click="retryFetch"
      >
        Try again
      </button>
    </div>
    <Transition name="fade">
      <div
        v-if="compareError"
        class="warning-banner"
      >
        <p>{{ compareError }}</p>
      </div>
    </Transition>
    <div class="desktop-only">
      <ProductTable
        v-model:search-query="searchQuery"
        v-model:toolbar="toolbar"
        :rows="searchedProducts"
        :is-loading="isLoading"
        :has-more="hasMore"
        :limit="currentLimit"
        @request="handleRequest"
        @reset-filters="resetFilters"
      />
    </div>
    <div class="mobile-toolbar-wrapper">
      <VToolbar
        v-model:search="searchQuery"
        v-model:filters="toolbar"
        :filter-configs="toolbarConfig"
        select-width="md"
        placeholder="Search by title, category or brand"
        @reset-filters="resetFilters"
      />
    </div>
    <div class="mobile-only">
      <div class="mobile-product-grid">
        <ProductCard
          v-for="product in searchedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <div
        v-if="hasMore"
        class="mobile-load-more"
      >
        <VButton
          text="Load More"
          size="full"
          :loader="isLoading"
          @click="handleRequest({ limit: currentLimit + 20 })"
        />
      </div>
    </div>
    <Compare
      :products="comparedProducts"
      @remove="removeProduct"
      @close="clearCompare"
    />
    <Favorite
      :products="savedProducts"
      @remove="(p) => toggleSaveProduct(false, p)"
    />
  </div>
</template>

<style scoped>
.products-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  background-color: #f9fafb;
}

.error-banner,
.warning-banner {
  position: absolute;
  top: 20px;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  margin: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.error-banner {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.warning-banner {
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.retry-button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #dc2626;
}

.mobile-only {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.mobile-toolbar-wrapper {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 12px;
  }

  .products-container {
    gap: 24px;
  }

  .mobile-toolbar-wrapper {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    background: white;
    padding: 12px;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
  }

  .mobile-product-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>

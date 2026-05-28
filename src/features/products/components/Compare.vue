<script setup lang="ts">
import { computed } from "vue";

import EmptyState from "@/features/products/components/EmptyState.vue";
import type { Product } from "@/features/products/types";
import { VTable } from "@/shared/components/index";
import { firstLetterUp } from "@/shared/utils/firstLetterUp";

interface CompareProps {
  products: Product[];
  compareLimit?: number;
}

const { products, compareLimit = 3 } = defineProps<CompareProps>();

const emit = defineEmits<{
  remove: [id: number];
  close: [];
}>();

const comparisonFields = [
  { label: "Price", key: "price", type: "price" },
  { label: "Rating", key: "rating", type: "rating" },
  { label: "Stock", key: "stock", type: "stock" },
  { label: "Category", key: "category", type: "text" },
  { label: "Discount", key: "discountPercentage", type: "discount" },
];

const isEmpty = computed(() => products.length === 0);
</script>

<template>
  <EmptyState
    v-if="isEmpty"
    title="Add products for comparing"
    text="Chose products from table"
  />
  <div
    v-if="!isEmpty"
    class="compare-container"
  >
    <div class="desktop-compare">
      <div class="compare-header">
        <h2 class="compare-title">
          Compare products
        </h2>
        <button
          class="compare-close-btn"
          @click="emit('close')"
        >
          Clear all
        </button>
      </div>
      <VTable
        variant="compare"
        :header="comparisonFields"
        :rows="products"
      >
        <template #compare-header="{ row }">
          <div class="product-header-content">
            <img
              :src="row.thumbnail"
              :alt="row.title"
              class="product-thumb"
            >
            <span class="product-title">{{ row.title }}</span>
            <button
              class="remove-btn"
              @click="emit('remove', row.id)"
            >
              Delete
            </button>
          </div>
        </template>
        <template #compare-empty>
          <div class="empty-placeholder">
            Add product for comparison
          </div>
        </template>
        <template #col-price="{ row }">
          ${{ row.price }}
        </template>
        <template #col-rating="{ row }">
          {{ row.rating }}
        </template>
        <template #col-stock="{ row }">
          {{ row.stock }}
        </template>
        <template #col-category="{ row }">
          {{ firstLetterUp(row.category) }}
        </template>
        <template #col-discountPercentage="{ row }">
          {{ row.discountPercentage }}%
        </template>
      </VTable>
    </div>
    <div class="mobile-compare">
      <div class="mobile-head">
        <div class="head-text">
          <h2 class="title">
            Comparison
          </h2>
          <p class="subtitle">
            {{ products.length }}/{{ compareLimit }} selected
          </p>
        </div>
        <button
          class="clear-btn"
          @click="emit('close')"
        >
          Clear
        </button>
      </div>
      <div class="scroll-wrapper no-scrollbar">
        <div class="comparison-grid">
          <div class="grid-row header-row">
            <div class="sticky-col label-header" />
            <div
              v-for="product in products"
              :key="'h-' + product.id"
              class="product-col"
            >
              <div class="mini-card">
                <img
                  :src="product.thumbnail"
                  :alt="product.title"
                >
                <button
                  class="remove-dot"
                  @click="emit('remove', product.id)"
                >
                  &times;
                </button>
              </div>
              <div class="p-name">
                {{ product.title }}
              </div>
            </div>
            <div
              v-for="n in compareLimit - products.length"
              :key="'eh-' + n"
              class="product-col empty"
            >
              <div class="add-placeholder">
                +
              </div>
              <div class="p-name">
                Add item
              </div>
            </div>
          </div>
          <div
            v-for="field in comparisonFields"
            :key="field.key"
            class="grid-row data-row"
          >
            <div class="sticky-col attribute-label">
              {{ field.label }}
            </div>
            <div
              v-for="product in products"
              :key="field.key + product.id"
              class="product-col value-cell"
            >
              <span
                v-if="field.type === 'price'"
                class="price-val"
              >
                ${{ product.price }}
              </span>
              <div
                v-else-if="field.type === 'rating'"
                class="rating-val"
              >
                {{ product.rating }}
              </div>
              <div
                v-else-if="field.type === 'stock'"
                class="stock-val"
                :class="{ low: product.stock < 10 }"
              >
                {{ product.stock }}
              </div>
              <span
                v-else-if="field.type === 'discount'"
                class="discount-val"
              >
                -{{ Math.round(product.discountPercentage) }}%
              </span>
              <span
                v-else
                class="text-val"
              >{{
                firstLetterUp((product as any)[field.key])
              }}</span>
            </div>

            <div
              v-for="n in compareLimit - products.length"
              :key="field.key + 'ev-' + n"
              class="product-col value-cell empty"
            >
              —
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-bar">
        <div class="swipe-hint">
          &larr; Swipe to compare details &rarr;
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-container {
  margin: 0 12px;
}

.desktop-compare {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.compare-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.compare-close-btn {
  background: #f3f4f6;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.compare-close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.product-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.product-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.product-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.remove-btn {
  background: none;
  border: 1px solid #fee2e2;
  color: #ef4444;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee2e2;
}

.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  color: #94a3b8;
  font-size: 13px;
  font-style: italic;
  background: #fcfdfe;
  border: 2px dashed #f1f5f9;
  border-radius: 8px;
  width: 100%;
}

.mobile-compare {
  display: none;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.mobile-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
}

.head-text .title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.head-text .subtitle {
  font-size: 12px;
  color: #64748b;

  font-weight: 200;
}

.clear-btn {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  transition: all 0.2s;
}

.clear-btn:active {
  background: #e2e8f0;
}

.scroll-wrapper {
  overflow-x: auto;
  background: #fff;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  width: max-content;
  min-width: 100%;
}

.grid-row {
  display: flex;
  align-items: stretch;
}

.sticky-col {
  width: 100px;
  flex-shrink: 0;
  position: sticky;
  left: 0;
  z-index: 10;
  background: #f8fafc;
  border-right: 1px solid #f1f5f9;
}

.product-col {
  width: 140px;
  flex-shrink: 0;
  border-right: 1px solid #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.header-row {
  background: #fff;
  border-bottom: 2px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 20;
}

.label-header {
  height: 140px;
  background: #fff;
}

.header-row .product-col {
  height: 140px;
  padding: 16px 10px;
  justify-content: flex-start;
  gap: 12px;
}

.product-col.empty {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mini-card {
  width: 64px;
  height: 64px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 6px;
  border: 1px solid #e2e8f0;
  position: relative;
}

.mini-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-dot {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.p-name {
  font-size: 11px;
  font-weight: 800;
  color: #334155;
  text-align: center;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.add-placeholder {
  width: 64px;
  height: 64px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 24px;
}

.data-row {
  border-bottom: 1px solid #f8fafc;
}

.data-row:nth-child(even) {
  background: #fcfdfe;
}

.attribute-label {
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value-cell {
  height: 54px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.value-cell.empty {
  color: #e2e8f0;
  font-weight: 400;
}

.price-val {
  color: #059669;
}
.star {
  color: #f59e0b;
  margin-right: 2px;
}
.discount-val {
  color: #ef4444;
}
.stock-val.low {
  color: #f59e0b;
}

.bottom-bar {
  background: #f8fafc;
  padding: 12px;
  border-top: 1px solid #f1f5f9;
}

.swipe-hint {
  text-align: center;
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* RESPONSIVE BREKPOINT: 768px */
@media (max-width: 768px) {
  .desktop-compare {
    display: none;
  }
  .mobile-compare {
    display: block;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<script setup lang="ts">
import { useCompare } from "../composables/useCompare";
import { useFavorites } from "../composables/useFavorites";

import type { Product } from "@/features/products/types";
import VCheckbox from "@/shared/components/VCheckbox.vue";
import Icon from "@/shared/components/icons/Icon.vue";

interface ProductCardProps {
  product: Product;
}

const props = defineProps<ProductCardProps>();

// Локалізована логіка дій всередині картки
const { isProductSaved, toggleSaveProduct } = useFavorites();
const { isInCompare, toggleCompare } = useCompare();
</script>

<template>
  <div class="product-card">
    <div class="image-wrapper">
      <img
        :src="props.product.thumbnail"
        :alt="props.product.title"
        class="product-image"
      >
      <button
        class="favorite-btn"
        @click="toggleSaveProduct(!isProductSaved(product.id), product)"
      >
        <Icon :filled="isProductSaved(product.id)" />
      </button>
      <div
        v-if="props.product.discountPercentage > 0"
        class="discount-badge"
      >
        -{{ Math.round(props.product.discountPercentage) }}%
      </div>
    </div>

    <div class="product-content">
      <div class="meta-row">
        <span class="category-tag">{{ props.product.category }}</span>
        <div class="rating">
          <span class="star">★</span>
          <span>{{ props.product.rating }}</span>
        </div>
      </div>

      <h3 class="product-title">
        {{ props.product.title }}
      </h3>
      <p class="product-brand">
        {{ props.product.brand || "No Brand" }}
      </p>

      <div class="price-row">
        <span class="price">${{ props.product.price }}</span>
        <span
          class="stock-info"
          :class="{ low: props.product.stock < 10 }"
        >
          {{
            props.product.stock > 0
              ? `${props.product.stock} in stock`
              : "Out of stock"
          }}
        </span>
      </div>

      <div class="actions">
        <VCheckbox
          label="Compare"
          variant="custom"
          text="Add to compare"
          :model-value="isInCompare(product.id)"
          @update:model-value="() => toggleCompare(product as Product)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  background: #f8fafc;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.product-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-tag {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.star {
  color: #f59e0b;
}

.product-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em;
}

.product-brand {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 12px 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  margin-bottom: 12px;
}

.price {
  font-size: 18px;
  font-weight: 800;
  color: #059669;
}

.stock-info {
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.stock-info.low {
  color: #ef4444;
}

.actions {
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}
</style>

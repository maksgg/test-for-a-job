<script setup lang="ts">
import { computed } from "vue";

import EmptyState from "@/features/products/components/EmptyState.vue";
import type { Product } from "@/features/products/types";

interface FavoriteProps {
  products: Product[];
}

const props = defineProps<FavoriteProps>();

const emit = defineEmits<{
  remove: [product: Product];
}>();

const isEmpty = computed(() => props.products.length === 0);

const handleRemove = (product: Product) => {
  emit("remove", product);
};
</script>

<template>
  <EmptyState
    v-if="isEmpty"
    title="Add favorite products"
    text="Toggle favorite status to add/remove products"
  />
  <section
    v-if="!isEmpty"
    class="favorite-section"
  >
    <div class="favorite-header">
      <h2 class="favorite-title">
        Favorites ({{ props.products.length }})
      </h2>
    </div>

    <div class="favorite-list no-scrollbar">
      <div
        v-for="product in props.products"
        :key="product.id"
        class="favorite-card"
      >
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="favorite-card-image"
        >
        <div class="favorite-card-info">
          <p class="favorite-card-title">
            {{ product.title }}
          </p>
          <p class="favorite-card-price">
            ${{ product.price }}
          </p>
        </div>
        <button
          class="favorite-card-remove"
          title="Видалити з обраного"
          @click="handleRemove(product)"
        >
          &times;
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.favorite-section {
  margin: 0 12px 24px 12px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  overflow: auto;
  box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.1);
}

.favorite-header {
  margin-bottom: 16px;
}

.favorite-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.favorite-list {
  display: grid; /* Перемикаємо на Grid */
  /* Автоматична адаптивна сітка без медіа-запитів */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-height: 45vh; /* Трохи збільшив, щоб сітка розкрила свій потенціал */
  overflow-y: auto;
  padding: 8px;
}

.favorite-card {
  /* ВИДАЛЯЄМО: width: 200px і flex: 0 0 200px */
  position: relative;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box; /* Гарантує, що паддінги не розіпруть картку */
}

.favorite-card:hover {
  border-color: #f59e0b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
}

.favorite-card-image {
  width: 100%;
  height: 120px;
  object-fit: contain;
  border-radius: 4px;
  background: white;
}

.favorite-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.favorite-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-card-price {
  font-size: 14px;
  font-weight: 700;
  color: #059669;
  margin: 0;
}

.favorite-card-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s ease;
  opacity: 0;
}

.favorite-card:hover .favorite-card-remove {
  opacity: 1;
}

.favorite-card-remove:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

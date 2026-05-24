import { ref } from "vue";

import type { Product } from "@/features/products/types";

// Спільний стан (Singleton)
const savedProducts = ref<Product[]>([]);
const isLoaded = ref(false);

export function useFavorites() {
  const loadSavedProducts = () => {
    if (isLoaded.value) return;
    const stored = localStorage.getItem("saved_products");
    if (stored) {
      try {
        savedProducts.value = JSON.parse(stored);
      } catch {
        savedProducts.value = [];
      }
    }
    isLoaded.value = true;
  };

  const isProductSaved = (id: number) =>
    savedProducts.value.some((p) => p.id === id);

  const toggleSaveProduct = (checked: boolean, product: Product) => {
    if (checked) {
      if (!isProductSaved(product.id)) {
        savedProducts.value.push(product);
      }
    } else {
      savedProducts.value = savedProducts.value.filter(
        (p) => p.id !== product.id,
      );
    }
    localStorage.setItem("saved_products", JSON.stringify(savedProducts.value));
  };

  return {
    savedProducts,
    loadSavedProducts,
    isProductSaved,
    toggleSaveProduct,
  };
}

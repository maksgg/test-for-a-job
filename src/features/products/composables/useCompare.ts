import { ref } from "vue";

import type { Product } from "@/features/products/types";

const comparedProducts = ref<Product[]>([]);
const errorMessage = ref<string | null>(null);
const isLoaded = ref(false);

export function useCompare() {
  const saveToStorage = () => {
    localStorage.setItem(
      "compared_products",
      JSON.stringify(comparedProducts.value),
    );
  };

  const loadComparedProducts = () => {
    if (isLoaded.value) return;
    const stored = localStorage.getItem("compared_products");
    if (stored) {
      try {
        comparedProducts.value = JSON.parse(stored);
      } catch {
        comparedProducts.value = [];
      }
    }
    isLoaded.value = true;
  };

  const isInCompare = (id: number) =>
    comparedProducts.value.some((p) => p.id === id);

  const toggleCompare = (product: Product) => {
    errorMessage.value = null;

    if (isInCompare(product.id)) {
      comparedProducts.value = comparedProducts.value.filter(
        (p) => p.id !== product.id,
      );
      saveToStorage();
      return;
    }

    if (comparedProducts.value.length >= 3) {
      errorMessage.value = "You can compare no more than 3 products at a time.";
      setTimeout(() => {
        errorMessage.value = null;
      }, 5000);
      return;
    }

    comparedProducts.value.push(product);
    saveToStorage();
  };

  const removeProduct = (id: number) => {
    comparedProducts.value = comparedProducts.value.filter((p) => p.id !== id);
    saveToStorage();
  };

  const clearCompare = () => {
    comparedProducts.value = [];
    saveToStorage();
  };

  return {
    comparedProducts,
    errorMessage,
    isInCompare,
    toggleCompare,
    removeProduct,
    clearCompare,
    loadComparedProducts,
  };
}

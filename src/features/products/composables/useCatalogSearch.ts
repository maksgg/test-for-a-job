import { ref, computed, watch, toValue, type MaybeRefOrGetter } from "vue";

import type { Product } from "@/features/products/types/index";

export function useCatalogSearch(
  products: MaybeRefOrGetter<Product[]>,
  delay = 300,
) {
  const searchQuery = ref("");
  const debouncedQuery = ref("");

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  watch(searchQuery, (newQuery) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      debouncedQuery.value = newQuery.trim().toLowerCase();
    }, delay);
  });

  const searchedProducts = computed<Product[]>(() => {
    const list = toValue(products);
    const query = debouncedQuery.value;

    if (!query) return list;

    return list.filter((product: Product) => {
      const matchTitle = product.title?.toLowerCase().includes(query);
      const matchBrand = product.brand?.toLowerCase().includes(query);
      const matchCateg = product.category?.toLowerCase().includes(query);

      return matchTitle || matchBrand || matchCateg;
    });
  });

  return {
    searchQuery,
    searchedProducts,
  };
}

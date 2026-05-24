import type { Product } from "../types";

export function filterProducts(
  products: Product[],
  activeFilter: string,
): Product[] {
  if (activeFilter === "category" || !activeFilter) {
    return products;
  }

  if (activeFilter === "in-stock") {
    return products.filter((p) => p.stock > 0);
  }

  if (activeFilter === "discounted") {
    return products.filter((p) => p.discountPercentage > 0);
  }

  return products.filter((p) => p.category === activeFilter);
}

export function sortProducts(
  products: Product[],
  activeSort: string,
): Product[] {
  const result = [...products];

  return result.sort((a, b) => {
    switch (activeSort) {
      case "p-low":
        return a.price - b.price;

      case "p-high":
        return b.price - a.price;

      case "r-high":
        return b.rating - a.rating;

      case "r-low":
        return a.rating - b.rating;

      case "A-Z":
        return a.title.localeCompare(b.title);

      case "Z-A":
        return b.title.localeCompare(a.title);

      default:
        return 0;
    }
  });
}

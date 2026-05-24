export const toolbarConfig = [
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
];

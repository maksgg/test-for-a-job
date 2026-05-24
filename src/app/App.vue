<script setup lang="ts">
import ProductCatalog from "@/pages/productCatalog/index.vue";
</script>

<template>
  <ProductCatalog />
</template>

<style>
/* Global resets and layout */
html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    background-color: #f3f4f6;
    color: #1f2937;
}

* {
    box-sizing: border-box;
}
</style>

<script setup lang="ts">
interface CompareProps {
  title: string;
  text: string;
}

const { title, text } = defineProps<CompareProps>();
</script>

<template>
  <div class="empty-state">
    <h3 class="title">
      {{ title }}
    </h3>
    <p class="text">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 1px 0 #f1f5f9;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  color: #000;
}

.text {
  margin: 0;
  font-size: 1rem;
  color: #666;
}
</style>

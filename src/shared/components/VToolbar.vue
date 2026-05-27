<script setup lang="ts">
import { computed } from "vue";

import VButton from "@/shared/components/VButton.vue";
import VDropDown from "@/shared/components/VDropDown.vue";
import VInput from "@/shared/components/VInput.vue";

type SelectOption = {
  name: string;
  value: string;
};

type FilterConfig = {
  key: string;
  label: string;
  options: SelectOption[];
};

type ToolbarProps = {
  filterConfigs?: FilterConfig[];
  isSearchable?: boolean;
  disabled?: boolean;
  selectWidth?: "sm" | "md" | "lg";
  placeholder?: string;
  resetOptions?: boolean;
};

const {
  filterConfigs = [],
  isSearchable = true,
  disabled = false,
  selectWidth = "sm",
  placeholder = "",
  resetOptions = true,
} = defineProps<ToolbarProps>();

const search = defineModel<string>("search");
const filters = defineModel<Record<string, any>>("filters", {
  default: () => ({}),
});

const emit = defineEmits<{ "reset-filters": [void] }>();

const updateFilter = (key: string, value: any) => {
  filters.value = {
    ...filters.value,
    [key]: value,
  };
};

const sizeClasses: Record<ToolbarProps["selectWidth"] & string, string> = {
  sm: "v-toolbar__select--sm",
  md: "v-toolbar__select--md",
  lg: "v-toolbar__select--lg",
};

const normalizedFilterConfigs = computed(() => {
  return filterConfigs.map((config) => ({
    ...config,
    options: (config.options || []).map((opt) => ({
      ...opt,
      label: opt.name || (opt as any).label || opt.value,
    })),
  }));
});

const resetFilters = () => {
  emit("reset-filters");
};
</script>

<template>
  <div class="v-toolbar">
    <div
      v-if="isSearchable"
      class="v-toolbar__search-container"
    >
      <VInput
        v-model="search"
        variant="toolbar"
        :disabled="disabled"
        :placeholder="placeholder"
        icon="magnifyingGlass"
      />
    </div>
    <VDropDown
      v-for="config in normalizedFilterConfigs"
      :key="config.key"
      :model-value="filters[config.key]"
      :options="config.options"
      :disabled="disabled"
      :title="config.label"
      class="v-toolbar__select"
      :class="sizeClasses[selectWidth]"
      @update:model-value="(val) => updateFilter(config.key, val)"
    />
    <div class="reset-btn">
      <VButton
        v-if="resetOptions"
        text="Reset filters"
        @click="resetFilters"
      />
    </div>
  </div>
</template>

<style scoped>
.v-toolbar {
  display: grid;
  grid-template-columns: repeat(4, auto);
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.reset-btn {
  margin-left: auto;
}

.v-toolbar__search-container {
  max-width: 22rem;
  flex-shrink: 0;
}

.v-toolbar__select {
  flex-shrink: 0;
}

.v-toolbar__select--sm {
  width: 12rem;
}

.v-toolbar__select--md {
  max-width: 100%;
}

.v-toolbar__select--lg {
  width: 20rem;
}

@media (max-width: 1124px) {
  .v-toolbar {
    grid-template-columns: repeat(2, auto);
    align-items: stretch;
    gap: 1rem;
  }
  .reset-btn {
    margin-left: 0;
  }

  .v-toolbar__search-container,
  .v-toolbar__select {
    width: 100% !important;
  }
}
@media (max-width:700px) {
  .v-toolbar {
    grid-template-columns: 1fr;
  }
}
</style>

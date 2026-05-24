<script setup lang="ts">
import { computed, ref } from "vue";

import VLoader from "./VLoader.vue";

type Option = {
  key?: string;
  value: string;
  label?: string;
  disabled?: boolean | null;
  flag?: string | null;
  dangerous?: boolean | unknown;
};

type DropDown = {
  id?: string;
  title?: string;
  modelValue?: string | number | null;
  options: Option[];
  disabled?: boolean;
  variant?: "primary" | "custom" | "languages";
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  loader?: boolean;
};

const props = withDefaults(defineProps<DropDown>(), {
  id: "",
  title: "",
  modelValue: null,
  options: () => [],
  disabled: false,
  variant: "primary",
  placement: "bottomLeft",
  loader: false,
});

const isOpened = ref(false);

const emit = defineEmits<{
  "update:modelValue": [string];
  action: [value?: any, key?: string];
  "update:loader": [value: boolean];
}>();

const toggle = (): void => {
  if (props.disabled) return;
  isOpened.value = !isOpened.value;
};

const selectedValue = (item: Option) => {
  emit("update:modelValue", item.value);
  emit("action", item.value, item.key);
  isOpened.value = !isOpened.value;
};

const selectedLabel = computed((): string => {
  const selectedItem = props.options.find(
    (el) => el.value === props.modelValue,
  );

  if (selectedItem) {
    return selectedItem.label || selectedItem.value;
  }

  return "Select option";
});
</script>

<template>
  <div
    class="v-dropdown"
    tabindex="0"
    @focusout="isOpened = false"
  >
    <span
      v-if="props.title"
      class="v-dropdown-title"
    >
      {{ props.title }}
    </span>
    <button
      class="v-dropdown-trigger"
      :class="[
        `v-dropdown-trigger--${props.variant}`,
        {
          'v-dropdown-trigger--disabled': props.disabled,
        },
      ]"
      :disabled="props.disabled"
      @click="toggle"
    >
      <slot
        v-if="$slots.trigger"
        name="trigger"
        :toggle="toggle"
        :label="selectedLabel"
      />
      <template v-else>
        <span class="v-dropdown-label">
          {{ selectedLabel }}
        </span>
        <span
          v-if="props.loader"
          class="v-dropdown-icon-container"
        >
          <VLoader size="sm" />
        </span>
      </template>
    </button>
    <ul
      v-if="isOpened"
      class="v-dropdown-menu"
      :class="[
        `v-dropdown-menu--${props.variant}`,
        `v-dropdown-menu--${props.placement}`,
        { 'v-dropdown-menu--disabled': props.disabled },
      ]"
      @mousedown.prevent
    >
      <li
        v-for="item in props.options"
        :key="item.value"
        class="v-dropdown-item"
        :class="{
          'v-dropdown-item--dangerous': item.dangerous,
          'v-dropdown-item--disabled': item.disabled,
        }"
        @click="selectedValue(item)"
      >
        <slot
          name="options"
          :item="item"
        />
        {{ item.label || item.value }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.v-dropdown {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.v-dropdown-title {
    font-size: var(--uiLabel-font-size, 14px);
    color: var(--secondary, #4b5563);
    font-weight: 500;
}

.v-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    min-height: 2.5rem;
}

.v-dropdown-trigger--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

/* Trigger Variants */
.v-dropdown-trigger--primary {
    border: 2px solid var(--borderDefault, #e5e7eb);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--secondaryBg, #f3f4f6);
}

.v-dropdown-trigger--primary:hover:not(.v-dropdown-trigger--disabled) {
    border-color: var(--borderHover, #2563eb);
}

.v-dropdown-trigger--custom {
    font-size: var(--bodyL-font-size, 16px);
    color: var(--txtPrimary, #111827);
}

.v-dropdown-trigger--languages {
    background-color: var(--primary, #3b82f6);
    padding: 0.25rem;
    color: var(--text-color, #ffffff);
}

.v-dropdown-label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: left;
}

.v-dropdown-icon-container {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

/* Menu Styles */
.v-dropdown-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 20;
    width: max-content;
    min-width: 100%;
    text-align: start;
    margin: 0;
    list-style: none;
}

.v-dropdown-menu--disabled {
    cursor: not-allowed;
}

/* Menu Variants */
.v-dropdown-menu--primary {
    border: 1px solid var(--borderDefault, #e5e7eb);
    border-radius: 0.5rem;
    background-color: var(--primaryBg, #ffffff);
    padding: 0.5rem;
    top: calc(100% + 4px);
}

.v-dropdown-menu--custom {
    font-size: var(--bodyL-font-size, 16px);
    color: var(--txtPrimary, #111827);
    background-color: var(--primaryBg, #ffffff);
}

.v-dropdown-menu--languages {
    background-color: var(--primary, #3b82f6);
    padding: 0.25rem;
    color: var(--text-color, #ffffff);
}

/* Menu Placements */
.v-dropdown-menu--topLeft {
    bottom: 100%;
    left: 0;
    margin-bottom: 4px;
}

.v-dropdown-menu--topRight {
    bottom: 100%;
    right: 0;
    margin-bottom: 4px;
}

.v-dropdown-menu--bottomLeft {
    top: 100%;
    left: 0;
    margin-top: 4px;
}

.v-dropdown-menu--bottomRight {
    top: 100%;
    right: 0;
    margin-top: 4px;
}

/* Items */
.v-dropdown-item {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: var(--bodyL-font-size, 16px);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.v-dropdown-item:hover:not(.v-dropdown-item--disabled) {
    background-color: var(--borderDefault, #e5e7eb);
}

.v-dropdown-item--dangerous {
    color: var(--dangerous, #ef4444);
}

.v-dropdown-item--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
</style>

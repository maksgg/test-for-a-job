<script setup lang="ts">
import { computed } from "vue";

import VLoader from "./VLoader.vue";

type ButtonStyle = "primary" | "dangerous" | "ghost" | "sidebar" | "secondary";

type ButtonSize = "sm" | "md" | "lg" | "fit" | "full";

type ButtonProps = {
  text?: string;
  showText?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loader?: boolean;
  variant?: ButtonStyle;
  size?: ButtonSize;
  tooltip?: string;
};

const props = withDefaults(defineProps<ButtonProps>(), {
  text: "",
  showText: true,
  type: "button",
  disabled: false,
  loader: false,
  variant: "primary",
  size: "fit",
  tooltip: "",
});

const iconTransform = computed(() => {
  if (props.variant !== "sidebar") return "";
  return !props.showText ? "translateX(-8px)" : "translateX(0)";
});

const btnStyleVariants: Record<ButtonStyle, string> = {
  primary: "v-button--primary",
  dangerous: "v-button--dangerous",
  secondary: "v-button--secondary",
  ghost: "v-button--ghost",
  sidebar: "v-button--sidebar",
};

const btnSize: Record<ButtonSize, string> = {
  sm: "v-button--sm",
  md: "v-button--md",
  lg: "v-button--lg",
  fit: "v-button--fit",
  full: "v-button--full",
};
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loader"
    v-bind="$attrs"
    class="v-button"
    :class="[btnStyleVariants[props.variant], btnSize[props.size]]"
  >
    <div
      v-if="$slots['icon-left'] || props.loader"
      class="v-button__icon-container"
      :style="{
        transform: iconTransform,
        transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      }"
    >
      <slot name="icon-left">
        <VLoader v-if="props.loader" />
      </slot>
    </div>
    <Transition name="sidebar-fade">
      <span
        v-if="showText"
        class="v-button__text"
        :class="{
          'v-button__text--truncate': props.variant === 'ghost',
        }"
      >
        <slot>{{ props.text }}</slot>
      </span>
    </Transition>
    <div
      v-if="$slots['icon-right']"
      class="v-button__icon-right"
    >
      <slot name="icon-right" />
    </div>
    <span
      v-if="props.tooltip && !showText"
      class="v-button__tooltip"
    >
      {{ props.tooltip }}
    </span>
  </button>
</template>

<style scoped>
.v-button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: var(--uiBtn-font-family);
    font-size: var(--uiBtn-font-size);
    color: var(--secondaryBgLight);
    cursor: pointer;
    border: none;
    background: none;
    transition: all 0.3s ease;
}

.v-button:disabled {
    border-color: var(--disabledBtn) !important;
    background-color: var(--disabledBtn) !important;
    color: var(--txtMutedLight) !important;
    box-shadow: none !important;
    cursor: not-allowed;
    pointer-events: none;
}

.v-button--primary {
    border: 1px solid var(--primary);
    background-color: var(--primary);
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
}

.v-button--primary:not(:disabled):hover {
    background-color: var(--activePrimary);
    border-color: var(--activePrimary);
}

.v-button--primary:not(:disabled):active {
    background-color: var(--activePrimary);
    box-shadow: none;
}

.v-button--dangerous {
    border: 1px solid var(--dangerous);
    background-color: var(--dangerous);
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
}

.v-button--dangerous:not(:disabled):hover {
    background-color: var(--activeDangerous);
    border-color: var(--activeDangerous);
}

.v-button--dangerous:not(:disabled):active {
    background-color: var(--activeDangerous);
    box-shadow: none;
}

.v-button--secondary {
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    transition: all 0.3s;
}

.v-button--secondary:not(:disabled):hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
}

.v-button--ghost {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    background: transparent;
    text-align: start;
    font-size: var(--bodyL-font-size);
    color: inherit;
}

.v-button--ghost:disabled {
    color: var(--txtMutedLight) !important;
    background: transparent !important;
    border: none !important;
}

.v-button--sidebar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
    border: none;
    background: transparent;
    white-space: nowrap;
    color: var(--txtSecondaryDark);
    line-height: 1;
}

.v-button--sidebar:hover {
    border-radius: 0.5rem;
    background-color: var(--sidebarHoverBtn);
    color: white;
}

/* Sizes */
.v-button--sm {
    width: 2.5rem;
}
.v-button--md {
    width: 8rem;
}
.v-button--lg {
    width: 10rem;
}
.v-button--fit {
    width: fit-content;
}
.v-button--full {
    width: 100%;
}

/* Elements */
.v-button__icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.v-button__text {
    display: inline-block;
    white-space: nowrap;
}

.v-button__text--truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.v-button__icon-right {
    display: flex;
}

.v-button__tooltip {
    pointer-events: none;
    position: absolute;
    bottom: 100%;
    left: 85%;
    transform: translateX(-25%);
    margin-bottom: 0.25rem;
    z-index: 100;
    white-space: nowrap;
    border-radius: 0.25rem;
    background-color: #1f2937;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

.v-button:hover .v-button__tooltip {
    opacity: 1;
}
</style>

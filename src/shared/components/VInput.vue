<script setup lang="ts">
import { computed, useId } from "vue";
import type { Ref } from "vue";

import VLoader from "./VLoader.vue";

defineOptions({
  inheritAttrs: false,
});

type VariantStyles = "main" | "toolbar";

type ValidationError = {
  $message: string | Ref<string>;
  [key: string]: any;
};

type Validation = {
  $error?: boolean;
  $errors?: ValidationError[];
  $dirty?: boolean;
  $touch?: () => void;
  [key: string]: any;
};

type InputProps = {
  id?: string;
  label?: string;
  type?: string;
  modelValue?: string;
  loader?: boolean;
  disabled?: boolean;
  validation?: Validation;
  supportText?: string;
  variant?: VariantStyles;
};

const props = withDefaults(defineProps<InputProps>(), {
  id: "",
  label: "",
  type: "text",
  modelValue: "",
  loader: false,
  disabled: false,
  validation: () => ({ $error: false, $errors: [] }),
  supportText: "",
  variant: "main",
});

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const updateModelValue = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit("update:modelValue", target.value);
};

const generatedId = useId();
const inputId = computed(() => props.id || `v-input-${generatedId}`);
</script>

<template>
  <div class="v-input-container">
    <label
      v-if="props.label"
      :for="inputId"
      class="v-input-label"
      :class="{
        'v-input-label--disabled': props.disabled,
        'v-input-label--error': props.validation.$error,
      }"
    >
      <slot name="label">
        {{ props.label }}
      </slot>
    </label>
    <div
      :class="[
        'v-input-wrapper',
        `v-input-wrapper--${props.variant}`,
        { 'v-input-wrapper--disabled': props.disabled },
      ]"
    >
      <div
        v-if="props.loader"
        class="v-input-loader"
      >
        <VLoader size="sm" />
      </div>
      <input
        :id="inputId"
        v-bind="$attrs"
        class="v-input"
        :class="[
          `v-input--${props.variant}`,
          { 'v-input--error': props.validation.$error },
          { 'v-input--with-loader': props.loader },
        ]"
        :type="props.type"
        :disabled="props.disabled"
        :value="props.modelValue"
        @input="updateModelValue"
      >
    </div>
    <div
      v-if="validation?.$error && validation?.$errors?.length"
      class="v-input-error-container"
    >
      <slot
        name="errorMsg"
        :message="validation.$errors[0]?.$message"
      >
        <span class="v-input-error-text">
          {{ validation.$errors[0]?.$message }}
        </span>
      </slot>
    </div>
    <div
      v-else-if="supportText"
      class="v-input-support-container"
    >
      <slot name="sup-text">
        <span class="v-input-support-text">
          {{ props.supportText }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.v-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.v-input-label {
    font-size: var(--uiLabel-font-size, 14px);
    color: var(--secondary, #4b5563);
    transition: color 0.2s;
}

.v-input-label--disabled {
    color: var(--disabledBorder, #d1d5db);
}

.v-input-label--error {
    color: var(--dangerous, #ef4444);
}

.v-input-wrapper {
    display: flex;
    position: relative;
    width: 100%;
}

.v-input-loader {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.v-input {
    width: 100%;
    outline: none;
    background-color: var(--secondaryBg, #f3f4f6);
    border: 2px solid var(--borderDefault, #e5e7eb);
    color: var(--txtPrimary, #111827);
    font-size: var(--bodyL-font-size, 16px);
    transition: all 0.2s ease;
}

.v-input:hover:not(:disabled) {
    border-color: var(--borderHover, #2563eb);
}

.v-input:focus:not(:disabled) {
    border-color: var(--primary, #3b82f6);
    background-color: #ffffff;
}

.v-input:disabled {
    border-color: var(--disabledBorder, #d1d5db);
    color: var(--disabledBorder, #d1d5db);
    cursor: not-allowed;
}

.v-input::placeholder {
    color: var(--muted, #9ca3af);
}

.v-input:disabled::placeholder {
    color: var(--disabledBorder, #d1d5db);
}

.v-input--with-loader {
    padding-left: 2.75rem !important;
}

/* Variant: main */
.v-input--main {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
}

.v-input--main:focus {
    box-shadow: var(--innerOutline, inset 0 0 0 2px rgba(59, 130, 246, 0.1));
}

/* Variant: toolbar */
.v-input--toolbar {
    max-width: 30rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
}

.v-input--toolbar::placeholder {
    color: var(--primary, #3b82f6);
}

.v-input--toolbar:hover::placeholder {
    color: var(--borderHover, #2563eb);
}

/* States */
.v-input--error {
    border-color: var(--dangerous, #ef4444);
}

.v-input--error:focus {
    box-shadow: none;
}

/* Messages */
.v-input-error-container {
    display: flex;
}

.v-input-error-text {
    color: var(--dangerousErrMsg, #dc2626);
    font-size: var(--uiCaption-font-size, 12px);
}

.v-input-support-container {
    display: flex;
}

.v-input-support-text {
    color: #6b7280;
    font-size: 0.875rem;
}
</style>

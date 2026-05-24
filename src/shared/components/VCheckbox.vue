<script setup lang="ts">
import { computed, useId } from "vue";

type CheckboxStyle = "primary" | "custom";

type CheckboxProps = {
  id?: string;
  text?: string;
  modelValue?: boolean;
  disabled?: boolean;
  variant?: CheckboxStyle;
  type?: string;
};

const props = withDefaults(defineProps<CheckboxProps>(), {
  id: "",
  text: "",
  modelValue: false,
  disabled: false,
  variant: "primary",
  type: "checkbox",
});

const inputId = computed(() => props.id || `v-input-${useId()}`);

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const checked = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    if (props.disabled) {
      return;
    }
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <label
    class="v-checkbox"
    :class="{
      'v-checkbox--disabled': props.disabled,
      'v-checkbox--clickable': !props.disabled,
    }"
    :for="inputId"
  >
    <input
      :id="inputId"
      v-model="checked"
      :disabled="props.disabled"
      type="checkbox"
      class="v-checkbox-input"
    >
    <slot name="box">
      <span
        class="v-checkbox-box"
        :class="[
          `v-checkbox-box--${props.variant}`,
          { 'v-checkbox-box--checked': checked },
          props.type === 'radio'
            ? 'v-checkbox-box--circle'
            : 'v-checkbox-box--rounded',
        ]"
      />
    </slot>
    <div
      v-if="props.text"
      class="v-checkbox-text"
    >
      <slot name="text">{{ props.text }}</slot>
    </div>
  </label>
</template>

<style scoped>
.v-checkbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
}

.v-checkbox--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.v-checkbox--clickable {
  cursor: pointer;
}

.v-checkbox-input {
  display: none;
}

.v-checkbox-box {
  border: 2px solid var(--borderDefault, #e5e7eb);
  background-color: var(--elevated, #ffffff);
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  position: relative;
}

.v-checkbox-box--rounded {
  border-radius: 4px;
}

.v-checkbox-box--circle {
  border-radius: 9999px;
}

/* Пташка (tick) для звичайного чекбокса */
.v-checkbox-box--rounded.v-checkbox-box--checked::after {
  content: "";
  position: absolute;
  width: 0.35rem;
  height: 0.6rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-top: -2px;
}

/* Крапка (dot) для радіо-кнопки */
.v-checkbox-box--circle.v-checkbox-box--checked::after {
  content: "";
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background-color: white;
  border-radius: 50%;
}

/* Стилі варіантів при виборі */
.v-checkbox-box--checked.v-checkbox-box--primary {
  border: none;
  background-color: var(--primary, #3b82f6);
}

.v-checkbox-box--checked.v-checkbox-box--custom {
  border: none;
  background-color: #22c55e; /* green-500 */
}

/* Текст лейбла */
.v-checkbox-text {
  position: relative;
  display: flex;
  gap: 0.5rem;
  font-size: var(--uiBtn-font-size, 14px);
  color: var(--txtPrimary, #111827);
}
</style>

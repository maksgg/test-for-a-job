<script setup lang="ts">
import { computed, ref } from "vue";

import VButton from "@/shared/components/VButton.vue";
import VLoader from "@/shared/components/VLoader.vue";

type TableParams = {
  sort: string;
  order: "asc" | "desc";
  limit: number;
};

type TableHeader = {
  key: string;
  label: string;
  textAlign?: string;
  width?: string;
};

type ToolbarConfig = {
  key: string;
  label: string;
  options: { name: string; value: string }[];
};

type TableProps = {
  header?: TableHeader[];
  rows: Record<string, any>[];
  isHeaderVisible?: boolean;
  loader?: boolean;
  localLoader?: string;
  sortAble?: boolean;
  showFilters?: boolean;
  searchable?: boolean;
  toolbarConfig?: ToolbarConfig[];
  hasMore?: boolean;
  limit?: number;
  variant?: "standard" | "compare";
  compareCount?: number;
};

const props = withDefaults(defineProps<TableProps>(), {
  header: () => [],
  rows: () => [],
  loader: false,
  localLoader: "",
  isHeaderVisible: true,
  sortAble: true,
  showFilters: false,
  searchable: false,
  toolbarConfig: () => [],
  hasMore: false,
  limit: 20,
  variant: "standard",
  compareCount: 3,
});

const GRID_COLUMNS_MAP: Record<number, string> = {
  1: "v-table-grid-cols-1",
  2: "v-table-grid-cols-2",
  3: "v-table-grid-cols-3",
  4: "v-table-grid-cols-4",
  5: "v-table-grid-cols-5",
  6: "v-table-grid-cols-6",
  7: "v-table-grid-cols-7",
  8: "v-table-grid-cols-8",
  9: "v-table-grid-cols-9",
  10: "v-table-grid-cols-10",
  11: "v-table-grid-cols-11",
  12: "v-table-grid-cols-12",
};

const gridFrames = computed(() => {
  if (props.variant === "compare") {
    // Always 1 labels column (150px) + N products columns (1fr each)
    return {
      class: "",
      style: {
        gridTemplateColumns: `150px repeat(${props.compareCount}, 1fr)`,
        minWidth: `${150 + props.compareCount * 200}px`,
      },
    };
  }

  const hasCustomWidth = props.header.some((el) => el.width);

  if (!hasCustomWidth) {
    return {
      class: GRID_COLUMNS_MAP[props.header.length] || "v-table-grid-cols-none",
      style: {},
    };
  }

  return {
    class: "",
    style: {
      gridTemplateColumns: props.header
        .map((el) => el.width || "1fr")
        .join(" "),
    },
  };
});

const sortState = ref<{ sort: string; order: "asc" | "desc" }>({
  sort: "",
  order: "asc",
});

const shouldShowFilter = (head: TableHeader): boolean => {
  if (!props.showFilters) return false;

  const technicalKeys = ["actions", "id", "edit", "status", "member"];
  const isTechnical = technicalKeys.some((el) =>
    head.key.toLowerCase().includes(el),
  );
  const hasNoLabel = !head.label || head.label.trim() === "";

  return !isTechnical && !hasNoLabel;
};

const emit = defineEmits<{ request: [params: TableParams] }>();

const sorted = (columnKey: string) => {
  if (sortState.value.sort === columnKey) {
    sortState.value.order = sortState.value.order === "asc" ? "desc" : "asc";
  } else {
    sortState.value.sort = columnKey;
    sortState.value.order = "asc";
  }

  emit("request", { ...sortState.value, limit: props.limit });
};

const loadMore = () => {
  if (!props.hasMore) return;

  emit("request", {
    ...sortState.value,
    limit: props.limit + 20,
  });
};
</script>

<template>
  <div class="v-table-container no-scrollbar">
    <div class="v-table-wrapper">
      <!-- Toolbar -->
      <div
        v-if="searchable || showFilters"
        class="v-table-toolbar-container"
      >
        <div class="v-table-toolbar">
          <slot
            name="toolBar"
            :tool-bar="toolbarConfig"
            :sort="sorted"
          />
        </div>
      </div>

      <!-- Standard Table -->
      <template v-if="variant === 'standard'">
        <div class="v-table-sticky-header">
          <div
            v-if="isHeaderVisible"
            class="v-table-header"
            :class="gridFrames.class"
            :style="gridFrames.style"
          >
            <div
              v-for="head in header"
              :key="head.key"
              class="v-table-header-cell"
              :class="[
                sortAble && shouldShowFilter(head)
                  ? 'v-table-header-cell--sortable'
                  : head.textAlign,
              ]"
            >
              <slot
                :name="`head-${head.key}`"
                :column="head"
              >
                {{ head.label }}
                <button
                  v-if="sortAble && shouldShowFilter(head)"
                  class="v-table-sort-button"
                  @click="sorted(head.key)"
                />
              </slot>
            </div>
          </div>
        </div>
        <div class="v-table-body no-scrollbar">
          <div class="v-table-rows">
            <div
              v-if="loader"
              class="v-table-loader-overlay"
            >
              <div class="v-table-loader-sticky">
                <VLoader size="md" />
              </div>
            </div>
            <div
              v-for="(row, index) in rows"
              :key="index"
              class="v-table-row"
              :class="gridFrames.class"
              :style="gridFrames.style"
            >
              <div
                v-if="localLoader === row.id"
                class="v-table-row-loader"
              >
                <VLoader size="sm" />
              </div>
              <div
                v-for="col in header"
                :key="col.key"
                class="v-table-cell"
                :class="[
                  col.textAlign,
                  col.key === 'actions'
                    ? 'v-table-cell--actions'
                    : 'v-table-cell--truncate',
                ]"
              >
                <span class="v-table-cell-label">{{ col.label }}</span>
                <div class="v-table-cell-content">
                  <slot
                    :name="`col-${col.key}`"
                    :row="row"
                    :index="index"
                    :local-loader="localLoader"
                  >
                    {{ row[col.key] }}
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Compare Variant (Transposed) -->
      <template v-else>
        <div class="v-table-sticky-header">
          <div
            class="v-table-header v-table-compare-header"
            :style="gridFrames.style"
          >
            <div class="v-table-header-cell">
              Parameters
            </div>
            <div
              v-for="row in rows"
              :key="row.id"
              class="v-table-header-cell product-header-cell"
            >
              <slot
                name="compare-header"
                :row="row"
              />
            </div>
            <!-- Empty product slots -->
            <div
              v-for="n in Math.max(0, props.compareCount - rows.length)"
              :key="'empty-h-' + n"
              class="v-table-header-cell empty-cell"
            >
              <slot name="compare-empty" />
            </div>
          </div>
        </div>
        <div class="v-table-body no-scrollbar">
          <div
            v-for="head in header"
            :key="head.key"
            class="v-table-row v-table-compare-row"
            :style="gridFrames.style"
          >
            <div class="v-table-cell attribute-label">
              {{ head.label }}
            </div>
            <div
              v-for="row in rows"
              :key="'val-' + row.id"
              class="v-table-cell attribute-value"
            >
              <slot
                :name="`col-${head.key}`"
                :row="row"
              >
                {{ row[head.key] }}
              </slot>
            </div>
            <!-- Empty value slots -->
            <div
              v-for="n in Math.max(0, props.compareCount - rows.length)"
              :key="'empty-v-' + n"
              class="v-table-cell attribute-value empty"
            />
          </div>
        </div>
      </template>

      <!-- Footer -->
      <div
        v-if="hasMore && variant === 'standard'"
        class="v-table-footer"
      >
        <VButton
          text="More"
          class="v-table-load-more"
          :disabled="loader"
          @click="loadMore"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-table-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.v-table-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: var(--text-color);
}

.v-table-sticky-header {
  flex-shrink: 0;
  z-index: 20;
  position: sticky;
  top: 0;
  background-color: var(--primaryBg, #ffffff);
  box-shadow: 0 1px 0 var(--disabledBorder, #f1f5f9);
  scrollbar-gutter: stable;
}

.v-table-toolbar-container {
  background-color: var(--primaryBg, #ffffff);
  scrollbar-gutter: stable;
}

.v-table-toolbar {
  display: grid;
  padding-bottom: 1.5rem;
}

.v-table-header {
  display: grid;
  background-color: var(--disabledBorder, #f1f5f9);
}

.v-table-header-cell {
  padding: 0.75rem 1rem;
  overflow: hidden;
  color: var(--txtPrimary, #1f2937);
  font-weight: 600;
  font-size: 14px;
}

.v-table-header-cell--sortable {
  display: flex;
  align-items: center;
}

.v-table-sort-button {
  margin-left: auto;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.v-table-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: auto;
  scrollbar-gutter: stable;
}

.v-table-rows {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100px;
}

.v-table-loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
  pointer-events: auto;
}

.v-table-loader-sticky {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
}

.v-table-row {
  position: relative;
  display: grid;
  border-bottom: 1px solid var(--borderDefault, #f1f5f9);
  transition: background-color 0.15s ease;
}

.v-table-row:not(.v-table-compare-row):hover {
  background-color: var(--secondaryBg, #f8fafc);
}

.v-table-row-loader {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

.v-table-cell {
  padding: 1rem;
  display: flex;
  align-items: center;
}

.v-table-cell-label {
  display: none;
  font-weight: 600;
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  width: 100px;
  flex-shrink: 0;
}

.v-table-cell-content {
  flex: 1;
  min-width: 0;
}

.v-table-cell--actions {
  overflow: visible;
}

.v-table-cell--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-table-footer {
  flex-shrink: 0;
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--disabledBorder, #f1f5f9);
  background-color: var(--primaryBg, #ffffff);
  z-index: 20;
  scrollbar-gutter: stable;
}

/* Compare Variant Specifics */
.v-table-compare-header .v-table-header-cell {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.product-header-cell {
  border-left: 1px solid #f1f5f9;
}

.attribute-label {
  background-color: #f8fafc;
  font-weight: 600;
  color: #64748b;
  width: 150px;
}

.attribute-value {
  justify-content: center;
  text-align: center;
  border-left: 1px solid #f1f5f9;
  font-weight: 500;
}

.empty-cell,
.attribute-value.empty {
  background-color: #fcfdfe;
}

/* Grid helper classes */
.v-table-grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.v-table-grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.v-table-grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.v-table-grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.v-table-grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
.v-table-grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
.v-table-grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.v-table-grid-cols-8 {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}
.v-table-grid-cols-9 {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}
.v-table-grid-cols-10 {
  grid-template-columns: repeat(10, minmax(0, 1fr));
}
.v-table-grid-cols-11 {
  grid-template-columns: repeat(11, minmax(0, 1fr));
}
.v-table-grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}
.v-table-grid-cols-none {
  grid-template-columns: none;
}

.text-left {
  text-align: left;
  justify-content: flex-start;
}
.text-center {
  text-align: center;
  justify-content: center;
}
.text-right {
  text-align: right;
  justify-content: flex-end;
}

/* Респонсив */
@media (max-width: 768px) {
  /* Тільки для стандартного виду перетворюємо в картки */
  .v-table-wrapper:not(:has(.v-table-compare-header)) .v-table-header {
    display: none !important;
  }

  .v-table-wrapper:not(:has(.v-table-compare-header)) .v-table-row {
    display: flex !important;
    flex-direction: column !important;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 16px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .v-table-wrapper:not(:has(.v-table-compare-header)) .v-table-cell {
    display: flex !important;
    padding: 8px 4px !important;
    border-bottom: 1px solid #f3f4f6;
    align-items: center;
  }

  .v-table-wrapper:not(:has(.v-table-compare-header)) .v-table-cell-label {
    display: block;
  }

  .v-table-wrapper:not(:has(.v-table-compare-header)) .v-table-cell-content {
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  /* Для режиму порівняння: залишаємо таблицю, але зменшуємо ширину */
  .v-table-compare-header,
  .v-table-compare-row {
    min-width: 600px !important; /* Трохи менше для мобілок */
  }

  .attribute-label {
    width: 100px !important;
    font-size: 12px;
    padding: 8px;
  }

  .v-table-header-cell {
    padding: 8px;
    font-size: 12px;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";

import VButton from "@/shared/components/VButton.vue";
import VLoader from "@/shared/components/VLoader.vue";

type TableParams = {
  sort: string;
  order: "asc" | "desc";
  limit: number;
  hasMore: boolean;
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

type Pagination = {
  hasMore: boolean;
  limit: number;
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
  pagination?: Pagination;
};

const {
  header = [],
  rows = [],
  loader = false,
  localLoader = "",
  isHeaderVisible = true,
  sortAble = true,
  showFilters = false,
  searchable = false,
  toolbarConfig = [],
  pagination = { hasMore: false, limit: 20 },
} = defineProps<TableProps>();

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
  const hasCustomWidth = header.some((el) => el.width);

  if (!hasCustomWidth) {
    return {
      class: GRID_COLUMNS_MAP[header.length] || "v-table-grid-cols-none",
      style: {},
    };
  }

  return {
    class: "",
    style: {
      gridTemplateColumns: header.map((el) => el.width || "1fr").join(" "),
    },
  };
});

const sortState = ref<{ sort: string; order: "asc" | "desc" }>({
  sort: "",
  order: "asc",
});

const shouldShowFilter = (head: TableHeader): boolean => {
  if (!showFilters) return false;

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

  emit("request", { ...sortState.value, ...pagination });
};

const loadMore = () => {
  const paginationPayload = {
    limit: pagination.limit + 20,
    hasMore: pagination.hasMore,
  };
  if (!pagination.hasMore) return;

  emit("request", { ...sortState.value, ...paginationPayload });
};
</script>

<template>
  <div class="v-table-container no-scrollbar">
    <div class="v-table-wrapper">
      <div class="v-table-sticky-header">
        <div
          v-if="searchable || showFilters"
          class="v-table-toolbar"
          :class="gridFrames.class"
          :style="gridFrames.style"
        >
          <slot name="toolBar" :tool-bar="toolbarConfig" :sort="sorted" />
        </div>
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
            <slot :name="`head-${head.key}`" :column="head">
              {{ head.label }}
            </slot>
          </div>
        </div>
      </div>
      <div class="v-table-body">
        <div class="v-table-rows">
          <div v-if="loader" class="v-table-loader-overlay">
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
            <div v-if="localLoader === row.id" class="v-table-row-loader">
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
        <VButton
          v-if="pagination.hasMore"
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
  color: var(--text-color);
}

.v-table-sticky-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--primaryBg, #ffffff);
}

.v-table-toolbar {
  display: grid;
  background-color: var(--primaryBg, #ffffff);
  padding-bottom: 1.5rem;
}

.v-table-header {
  display: grid;
  background-color: var(--disabledBorder, #f1f5f9);
}

.v-table-header-cell {
  padding: 0.5rem;
  overflow: hidden;
  color: var(--txtPrimary);
}

.v-table-header-cell--sortable {
  display: flex;
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
  border-radius: 0.375rem;
}

.v-table-loader-sticky {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
}

.v-table-row {
  position: relative;
  display: grid;
  border-color: var(--borderDefault);
  transition: background-color 0.15s ease;
}

.v-table-row:hover {
  background-color: var(--secondaryBg);
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
  border-radius: 0.375rem;
}

.v-table-cell {
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-bottom: 1px solid #000;
}

.v-table-cell--actions {
  overflow: visible;
}

.v-table-cell--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-table-load-more {
  margin: 1.25rem 0;
  align-self: center;
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

/* Alignment helper classes */
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
</style>

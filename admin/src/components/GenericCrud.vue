<template>
  <div>
    <div v-show="!dialog">
      <div class="d-flex align-center mb-4">
        <v-text-field
          v-model="search"
          :label="`Search ${entityName}`"
          append-inner-icon="mdi-magnify"
          class="me-4"
          hide-details
          variant="outlined"
        />
        <v-btn
          color="primary"
          @click="createItem"
          :disabled="isEditDisabledForUser"
          :class="isEditDisabledForUser ? 'curor-not-allowed' : ''"
        >
          <v-icon start> mdi-plus </v-icon>
          Add {{ entityName }}
        </v-btn>
        <!-- export as CSV -->
        <!-- <v-btn color="primary" class="ms-4" @click="exportAsCSV">
          <v-icon start> mdi-file-export </v-icon>
          Export as CSV
        </v-btn> -->
        <v-menu :close-on-content-click="false" v-model="exportMenu">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" class="ms-4" v-bind="props">
              <v-icon start> mdi-file-export </v-icon>
              Export as CSV
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Select Columns to Export</v-card-title>
            <v-card-text>
              <div v-for="header in headers" :key="header.key">
                <v-checkbox
                  v-if="header.key !== 'actions'"
                  v-model="selectedColumnsToExport"
                  :label="header.title"
                  :value="header.key"
                  hide-details
                  multiple
                />
              </div>
            </v-card-text>
            <v-card-actions>
              <!-- select all btn -->
              <v-btn
                color="primary"
                size="small"
                variant="outlined"
                class="ms-4"
                @click="selectAllColumnsToExport"
              >
                Select All
              </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                @click="exportAsCSV"
                size="small"
              >
                Export
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

      <v-data-table
        :headers="headers"
        :items="
          items.filter((item) => {
            return Object.keys(columnFilter).every((key) => {
              if (!columnFilter[key]) return true;
              const value = item[key]
                ?.toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              return value?.includes(
                columnFilter[key]
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
              );
            });
          })
        "
        :search="search"
        class="elevation-1"
        :items-per-page="50"
        :items-per-page-options="[10, 50, 100, 200, -1]"
        v-model:expanded="expanded"
        :show-expand="expandable"
        expand-on-click
        style="overflow-x: scroll"
        :loading="loading"
        :sort-by="sortByComputed"
      >
        <template
          v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }"
        >
          <tr>
            <template v-for="column in columns" :key="column.key">
              <th>
                <span
                  class="mr-2 cursor-pointer"
                  @click="() => toggleSort(column)"
                  >{{ column.title }}</span
                >
                <template v-if="isSorted(column)">
                  <v-icon :icon="getSortIcon(column)"></v-icon>
                </template>
              </th>
            </template>
          </tr>
          <tr>
            <!-- display search for each field -->
            <th v-for="column in columns" :key="column.key">
              <v-text-field
                v-if="
                  column.key !== 'actions' && column.key !== 'data-table-expand'
                "
                v-model="columnFilter[column.key]"
                hide-details
                variant="outlined"
                density="compact"
              />
            </th>
          </tr>
        </template>

        <!-- Sub-table expansion panel -->
        <template #expanded-row="{ item }">
          <td :colspan="headers.length" v-if="hasSubTable(item)">
            <v-data-table
              :headers="getSubTableHeaders(item)"
              :items="item.subTable"
              class="mt-2"
            />
          </td>
        </template>

        <!-- for row with key imageUrl display image -->
        <template #item.imageUrl="{ item }">
          <v-img
            v-if="item.imageUrl"
            :src="getAssetUrl(item.imageUrl[0])"
            class="ma-2"
          />
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center">
            <v-tooltip text="Status: Draft">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-if="item.itemPublishStatus === 'DRAFT'"
                  color="warning"
                  v-bind="props"
                >
                  mdi-alert-circle
                </v-icon>
              </template>
            </v-tooltip>

            <v-icon
              size="small"
              @click="editItem(item)"
              :disabled="isEditDisabledForUser"
              :class="isEditDisabledForUser ? 'curor-not-allowed' : ''"
            >
              mdi-pencil
            </v-icon>

            <v-icon
              size="small"
              @click="deleteItem(item)"
              :disabled="isDeleteDisabledForUser || !isDeleteEnabledForItem"
              :class="isDeleteDisabledForUser ? 'curor-not-allowed' : ''"
            >
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- Main Dialog -->
    <div v-show="dialog" fullscreen scrlollable persistent>
      <v-card>
        <v-card color="secondary" rounded="0" elevation="0">
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
        </v-card>

        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="form">
              <v-row>
                <v-col v-for="field in entityFields" :key="field.key" cols="12">
                  <!-- Regular fields -->
                  <template v-if="!field.isArray">
                    <v-text-field
                      v-if="field.type === 'text'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :disabled="isEditDisabled(field)"
                      density="compact"
                    />

                    <v-text-field
                      v-else-if="field.type === 'number'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :disabled="isEditDisabled(field)"
                      type="number"
                      density="compact"
                    />

                    <!-- type date -->
                    <v-text-field
                      v-else-if="field.type === 'date'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :disabled="isEditDisabled(field)"
                      type="date"
                      density="compact"
                    />

                    <!-- type month -->
                    <v-text-field
                      v-else-if="field.type === 'month'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :disabled="isEditDisabled(field)"
                      type="month"
                      density="compact"
                    />

                    <v-textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :disabled="isEditDisabled(field)"
                      density="compact"
                    />

                    <!-- Replace the QuillEditor with SunEditor -->
                    <SunEditorComponent
                      v-if="field.type === 'editor'"
                      v-model="editedItem[field.key]"
                      :toolbar="'essential'"
                      :contentType="'html'"
                    />

                    <v-autocomplete
                      v-else-if="field.type === 'auto-complete'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :items="field.items"
                      :disabled="isEditDisabled(field)"
                      density="compact"
                      :multiple="field.multiple"
                    />

                    <v-autocomplete
                      v-else-if="field.type === 'auto-complete-function'"
                      v-model="editedItem[field.key]"
                      :label="field.label"
                      :rules="field.rules"
                      variant="outlined"
                      :items="field.itemFunction(editedItem)"
                      :disabled="isEditDisabled(field)"
                      density="compact"
                      :multiple="field.multiple"
                    />

                    <ImageUpload
                      v-else-if="field.type === 'image'"
                      :images="
                        editedItem[field.key]
                          ? Array.isArray(editedItem[field.key])
                            ? editedItem[field.key]
                            : []
                          : []
                      "
                      @images-updated="
                        (images) => (editedItem[field.key] = images)
                      "
                      :key="editedItem[field.key].length"
                      :title="field.label"
                    />

                    <DocumentUpload
                      v-else-if="field.type === 'document'"
                      :files="editedItem[field.key]"
                      @files-updated="
                        (documents) => (editedItem[field.key] = documents)
                      "
                      :key="editedItem[field.key].length * 1"
                      :title="field.label"
                    />

                    <ColorPicker
                      v-else-if="field.type === 'color-picker'"
                      :files="editedItem[field.key]"
                      @selectedColor="
                        (documents) => (editedItem[field.key] = documents)
                      "
                    />

                    <!-- display type =component -->
                    <component
                      v-else-if="field.type === 'component'"
                      :is="field.component"
                      :editedItem="editedItem"
                      v-bind="field.props || {}"
                      @update:editedItem="(val) => (editedItem = val)"
                    />
                  </template>

                  <!-- Array/Sub-table fields -->
                  <template v-else>
                    <v-card class="pa-4">
                      <div
                        class="d-flex justify-space-between align-center mb-4"
                      >
                        <div class="text-h6">{{ field.label }}</div>
                        <v-btn
                          color="primary"
                          size="small"
                          @click="addSubTableRow(field.key)"
                        >
                          Add Row
                        </v-btn>
                      </div>

                      <v-table v-if="editedItem[field.key]?.length">
                        <thead>
                          <tr>
                            <th
                              v-for="subField in field.fields"
                              :key="subField.key"
                            >
                              {{ subField.label }}
                            </th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(row, index) in editedItem[field.key]"
                            :key="index"
                          >
                            <td
                              v-for="subField in field.fields"
                              :key="subField.key"
                            >
                              <!-- if type is auto-complete -->
                              <v-autocomplete
                                v-if="subField.type === 'auto-complete'"
                                v-model="row[subField.key]"
                                :items="subField.items"
                                :multiple="subField.multiple"
                                density="compact"
                                hide-details
                                variant="outlined"
                              />
                              <v-text-field
                                v-if="subField.type === 'text'"
                                v-model="row[subField.key]"
                                :type="subField.type"
                                variant="outlined"
                                density="compact"
                                hide-details
                              />
                            </td>
                            <td>
                              <v-icon
                                size="small"
                                @click="removeSubTableRow(field.key, index)"
                                color="error"
                              >
                                mdi-delete
                              </v-icon>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card>
                  </template>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="outlined" rounded="pill" @click="close">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            rounded="pill"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import axiosInstance from "@/axios";
import {
  ref,
  onMounted,
  computed,
  defineProps,
  defineEmits,
  watch,
  reactive,
} from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { inject } from "vue";
import { ulid } from "ulidx";
import ImageUpload from "./ImageUpload.vue";
import DocumentUpload from "./DocumentUpload.vue";
import SunEditorComponent from "./SunEditorComponent.vue";
import ColorPicker from "./ColorPicker.vue";

import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const store = useAppStore();
const { isEditDisabledForUser, isDeleteDisabledForUser } = storeToRefs(store);

const props = defineProps({
  entityName: {
    type: String,
    required: true,
  },
  apiEndpoint: {
    type: String,
    required: true,
  },
  entityFields: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  addIdToPayload: {
    default: false,
  },
  expandable: {
    default: false,
  },
  sortBy: {
    type: Object,
    required: false,
  },
  fetchItemsWithPagination: {
    default: false,
  },
  fixedValues: {
    type: Object,
    required: false,
  },
  updateItemPendingForDeployment: {
    default: true,
    type: Boolean,
    required: false,
  },
  isDeleteEnabledForItem: {
    default: true,
    type: Boolean,
    required: false,
  },
  queryParams: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  refreshData: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits([
  "item-created",
  "item-updated",
  "item-deleted",
  "data-model-updated",
  "all-items",
]);

const swal = inject("$swal");
const $toast = useToast();

const search = ref("");
const dialog = ref(false);
const editedIndex = ref(-1);
const expandedItems = ref(new Set());
const expanded = ref([]);

let loading = ref(false);

let exportMenu = ref(false);
let selectedColumnsToExport = ref([]);

const getAssetUrl = (image) => {
  return import.meta.env.VITE_IMAGE_CLOUDFRONT + image;
};

// function for sortyBy if it is not provided then sort by id
const sortByComputed = computed(() => {
  return props.sortBy ? props.sortBy : [{ key: "id", order: "desc" }];
});

// Quill editor options
const options = {
  debug: "info",
  modules: {
    toolbar: ["bold", "italic", "underline"],
  },
  placeholder: "Compose an epic...",
  readOnly: true,
  theme: "snow",
};

// add required fields into selectedColumnsToExport array so that they are pre-selected
selectedColumnsToExport.value = props.entityFields
  .filter((field) => field.rules)
  .map((field) => field.key);

let valid = ref(false);

let columnFilter = reactive({});

// Create a default item based on entity fields
const defaultItem = computed(() => {
  return props.entityFields.reduce((acc, field) => {
    if (field.isArray) {
      acc[field.key] = [];
    }
    // else if type is auto-complete and multiple is true then set it to an empty array
    else if (field.type === "auto-complete" && field.multiple) {
      acc[field.key] = [];
    } else {
      acc[field.key] = field.defaultValue || "";
    }
    return acc;
  }, {});
});

const editedItem = ref({ ...defaultItem.value });

watch(
  () => editedItem,
  () => {
    emit("data-model-updated", editedItem.value);
  },
  { deep: true }
);

const formTitle = computed(() => {
  return editedIndex.value === -1
    ? `Create ${props.entityName}`
    : `Edit ${props.entityName}`;
});

const items = ref([]);

const hasSubTable = (item) => {
  return (
    item.subTable && Array.isArray(item.subTable) && item.subTable.length > 0
  );
};

const getSubTableHeaders = (item) => {
  if (!item.subTable || !item.subTable[0]) return [];
  return Object.keys(item.subTable[0]).map((key) => ({
    title: key,
    key: key,
  }));
};

const expandRow = (item) => {
  if (expandedItems.value.has(item)) {
    expandedItems.value.delete(item);
  } else {
    expandedItems.value.add(item);
  }
};

const addSubTableRow = (key) => {
  if (!editedItem.value[key]) {
    editedItem.value[key] = [];
  }

  const newRow = props.entityFields
    .find((field) => field.key === key)
    .fields.reduce((acc, field) => {
      acc[field.key] = field.defaultValue || "";
      return acc;
    }, {});

  editedItem.value[key].push(newRow);
};

const removeSubTableRow = (key, index) => {
  editedItem.value[key].splice(index, 1);
};

const isEditDisabled = (field) => {
  if (editedIndex.value !== -1) {
    return field.editDisabled;
  }
  return false;
};

const fetchItems = async () => {
  try {
    loading.value = true;
    if (props.fetchItemsWithPagination) {
      let allItems = [];
      let lastEvaluatedKey = null;

      do {
        //  get id token
        const response = await axiosInstance.get(props.apiEndpoint, {
          params: {
            lastEvaluatedKey: lastEvaluatedKey,
            limit: 10000,
          },
        });

        allItems = allItems.concat(response.data.data);
        lastEvaluatedKey = response.data.lastEvaluatedKey;
      } while (lastEvaluatedKey);

      items.value = allItems;
    } else {
      //  get id token
      console.log("queryParams", props.queryParams);
      const response = await axiosInstance.get(props.apiEndpoint, {
        params: {
          ...props.queryParams,
        },
      });
      items.value = response.data;
    }
    emit("all-items", items.value);
    loading.value = false;
  } catch (error) {
    console.error(`Error fetching ${props.entityName}:`, error);
    $toast.open({
      type: "error",
      position: "top-right",
      message: `Error fetching ${props.entityName}`,
    });
  }
};

defineExpose({
  fetchItems,
});

const createItem = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
  dialog.value = true;
};

const editItem = (item) => {
  // check if edit disabled for user
  if (isEditDisabledForUser.value) {
    return;
  }
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const updatePendingForDeployment = async () => {
  //make POST call to /deploy/pending

  store.isDeploymentPending = true;

  await axiosInstance.post("/deploy/pending", {});
};

const deleteItem = (item) => {
  // check if delete disabled for user
  if (isDeleteDisabledForUser.value) {
    return;
  }
  swal({
    title: "Are you sure?",
    text: `You won't be able to revert this ${props.entityName}!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(props.apiEndpoint, {
          data: item,
        });

        if (response.status === 200) {
          // update pending for deployment
          await updatePendingForDeployment();

          await fetchItems();
          emit("item-deleted", item);
          $toast.open({
            type: "success",
            position: "top-right",
            message: `${props.entityName} deleted successfully`,
          });
        } else {
          $toast.open({
            type: "error",
            position: "top-right",
            message: "There was some error. Please try again",
          });
        }
      } catch (error) {
        console.error(`Error deleting ${props.entityName}:`, error);
        $toast.open({
          type: "error",
          position: "top-right",
          message: "There was some error. Please try again",
        });
      }
    }
  });
};

const close = () => {
  // reset form
  if (form.value) {
    form.value.resetValidation();
  }

  dialog.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
};

const form = ref(null);

const save = async () => {
  try {
    // validate form
    console.log("validate form");
    const { valid } = await form.value.validate();
    console.log("valid", valid);
    if (!valid) {
      $toast.open({
        type: "error",
        position: "top-right",
        message: "Please fill all the required fields",
      });
      return;
    }
    const payload = { ...editedItem.value };
    if (props.addIdToPayload && editedIndex.value === -1) {
      payload.id = ulid();
    }

    //  check if meta data is present
    if (payload.metadata) {
      payload.metadata.updated_at = new Date().toISOString();
      payload.metadata.updated_by = store.user.username;
    } else {
      payload.metadata = {
        created_by: store.user.username,
        updated_by: store.user.username,

        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
    }

    // append fixedValues to payload if not exists
    if (props.fixedValues) {
      for (const [key, value] of Object.entries(props.fixedValues)) {
        if (!payload[key]) {
          payload[key] = value;
        }
      }
    }

    console.log("payload", payload);

    const response = await axiosInstance.post(props.apiEndpoint, payload);

    if (response.status === 200) {
      $toast.open({
        type: "success",
        position: "top-right",
        message: `${props.entityName} saved successfully`,
      });

      await fetchItems();

      // update pending for deployment
      if (props.updateItemPendingForDeployment) {
        await updatePendingForDeployment();
      }

      // Emit events for parent component to listen
      if (editedIndex.value === -1) {
        emit("item-created", payload);
      } else {
        emit("item-updated", payload);
      }

      close();
    } else {
      // get error message
      console.log("response", response.data);
      const errorMessage = response.data
        ? response.data.error
        : "There was some error. Please try again";
      console.error("errorMessage", errorMessage);
      $toast.open({
        type: "error",
        position: "top-right",
        message: "There was some error. Please try again",
      });
    }
  } catch (error) {
    console.error(`Error saving ${props.entityName}:`, error);
    const errorMessage = error.response.data
      ? error.response.data.error
      : "There was some error. Please try again";
    $toast.open({
      type: "error",
      position: "top-right",
      message: errorMessage,
    });
  }
};

const selectAllColumnsToExport = () => {
  selectedColumnsToExport.value = props.headers
    .map((header) => header.key)
    .filter((key) => key !== "actions");
};

const exportAsCSV = () => {
  // Add BOM for Excel UTF-8 detection
  const BOM = "\uFEFF";

  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);
    // Check if value needs to be quoted
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      // Escape quotes and wrap in quotes
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // console.log("selectedColumnsToExport", selectedColumnsToExport.value);

  // console.log("columnFilter", columnFilter);

  // Filter items based on columnFilter before generating CSV
  const filteredItems = items.value.filter((item) => {
    // First check all column filters, regardless of selected columns
    const passesAllFilters = Object.entries(columnFilter).every(
      ([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key] || "").toLowerCase();
        return itemValue.includes(value.toLowerCase());
      }
    );

    return passesAllFilters;
  });

  const csvContent = filteredItems
    .map((item) => {
      return selectedColumnsToExport.value
        .map((key) => {
          // Check if there's a header with a value function for this key
          const header = props.headers.find((h) => h.key === key);
          if (header && typeof header.value === "function") {
            return escapeCSVValue(header.value(item));
          }
          return escapeCSVValue(item[key]);
        })
        .join(",");
    })
    .join("\n");

  const csvHeader = selectedColumnsToExport.value
    .map((key) =>
      escapeCSVValue(
        props.entityFields.find((header) => header.key === key)?.label ||
          props.headers.find((header) => header.key === key)?.title ||
          key
      )
    )
    .join(",");

  const csvData = `${BOM}${csvHeader}\n${csvContent}`;

  // Create blob with proper encoding
  const blob = new Blob([csvData], {
    type: "text/csv;charset=utf-8",
  });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${props.entityName}.csv`);

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Free up memory};

  // unselect all columns
  selectedColumnsToExport.value = [];
  exportMenu.value = false;
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
/* Add your styles here */
.curor-not-allowed {
  pointer-events: auto !important;
  cursor: not-allowed !important;
}
</style>

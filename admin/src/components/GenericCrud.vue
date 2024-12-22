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
      </div>

      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        class="elevation-1"
        :items-per-page="50"
        :items-per-page-options="[10, 50, 100, 200, -1]"
        v-model:expanded="expanded"
        :show-expand="expandable"
        expand-on-click
      >
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

        <template #item.actions="{ item }">
          <v-icon
            class="me-2"
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
            :disabled="isEditDisabledForUser"
            :class="isEditDisabledForUser ? 'curor-not-allowed' : ''"
          >
            mdi-delete
          </v-icon>
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

                  <v-textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="editedItem[field.key]"
                    :label="field.label"
                    :rules="field.rules"
                    variant="outlined"
                    :disabled="isEditDisabled(field)"
                    density="compact"
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

                  <ImageUpload
                    v-else-if="field.type === 'image'"
                    :images="editedItem[field.key]"
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
                </template>

                <!-- Array/Sub-table fields -->
                <template v-else>
                  <v-card class="pa-4">
                    <div class="d-flex justify-space-between align-center mb-4">
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
                            <v-text-field
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
import axios from "axios";
import { ref, onMounted, computed, defineProps, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { inject } from "vue";
import { ulid } from "ulidx";
import ImageUpload from "./ImageUpload.vue";
import DocumentUpload from "./DocumentUpload.vue";

import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const store = useAppStore();
const { isEditDisabledForUser } = storeToRefs(store);

import { getUserIdToken } from "@/services/auth";

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
});

const emit = defineEmits(["item-created", "item-updated", "item-deleted"]);

const swal = inject("$swal");
const $toast = useToast();

const search = ref("");
const dialog = ref(false);
const editedIndex = ref(-1);
const expandedItems = ref(new Set());
const expanded = ref([]);

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
    //  get id token
    const idToken = await getUserIdToken();

    const response = await axios.get(props.apiEndpoint, {
      headers: {
        Authorization: `${idToken}`,
      },
    });
    items.value = response.data;
  } catch (error) {
    console.error(`Error fetching ${props.entityName}:`, error);
    $toast.open({
      type: "error",
      position: "top-right",
      message: `Error fetching ${props.entityName}`,
    });
  }
};

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

const deleteItem = (item) => {
  // check if delete disabled for user
  if (isEditDisabledForUser.value) {
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
        //  get id token
        const idToken = await getUserIdToken();

        const response = await axios.delete(props.apiEndpoint, {
          data: item,
          headers: {
            Authorization: `${idToken}`,
          },
        });

        if (response.status === 200) {
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
  dialog.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
};

const save = async () => {
  try {
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

    console.log("payload", payload);

    //  get id token
    const idToken = await getUserIdToken();

    const response = await axios.post(props.apiEndpoint, payload, {
      headers: {
        Authorization: `${idToken}`,
      },
    });

    if (response.status === 200) {
      $toast.open({
        type: "success",
        position: "top-right",
        message: `${props.entityName} saved successfully`,
      });

      await fetchItems();

      // Emit events for parent component to listen
      if (editedIndex.value === -1) {
        emit("item-created", payload);
      } else {
        emit("item-updated", payload);
      }

      close();
    } else {
      $toast.open({
        type: "error",
        position: "top-right",
        message: "There was some error. Please try again",
      });
    }
  } catch (error) {
    console.error(`Error saving ${props.entityName}:`, error);
    $toast.open({
      type: "error",
      position: "top-right",
      message: "There was some error. Please try again",
    });
  }
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

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-text-field
        v-model="search"
        :label="`Search ${entityName}`"
        append-inner-icon="mdi-magnify"
        class="me-4"
        hide-details
        variant="outlined"
      />
      <v-btn color="primary" @click="createItem">
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
    >
      <template #item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="auto" persistent min-width="400">
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
                <v-text-field
                  v-if="field.type === 'text'"
                  v-model="editedItem[field.key]"
                  :label="field.label"
                  :rules="field.rules"
                  variant="outlined"
                  :disabled="isEditDisabled(field)"
                />

                <v-textarea
                  v-else-if="field.type === 'text-area'"
                  v-model="editedItem[field.key]"
                  :label="field.label"
                  :rules="field.rules"
                  variant="outlined"
                  :disabled="isEditDisabled(field)"
                />

                <!-- auto complete -->
                <v-autocomplete
                  v-else-if="field.type === 'auto-complete'"
                  v-model="editedItem[field.key]"
                  :label="field.label"
                  :rules="field.rules"
                  variant="outlined"
                  :items="field.items"
                  :disabled="isEditDisabled(field)"
                />
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
    </v-dialog>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed, defineProps, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { inject } from "vue";

const props = defineProps({
  // Configuration for the CRUD component
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
});

const emit = defineEmits(["item-created", "item-updated", "item-deleted"]);

const swal = inject("$swal");
const $toast = useToast();

const search = ref("");
const dialog = ref(false);
const editedIndex = ref(-1);

// Create a default item based on entity fields
const defaultItem = computed(() => {
  return props.entityFields.reduce((acc, field) => {
    acc[field.key] = field.defaultValue || "";
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

// const getInputComponent = (field) => {
//   switch (field.type) {
//     case "number":
//       return "v-text-field";
//     case "date":
//       return "v-text-field";
//     default:
//       return "v-text-field";
//   }
// };
const isEditDisabled = (field) => {
  // if is edit
  if (editedIndex.value !== -1) {
    return field.editDisabled;
  }
};

const fetchItems = async () => {
  try {
    const response = await axios.get(props.apiEndpoint);
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
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItem = (item) => {
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
        const response = await axios.delete(props.apiEndpoint, {
          data: item,
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
    const response = await axios.post(props.apiEndpoint, editedItem.value);

    if (response.status === 200) {
      $toast.open({
        type: "success",
        position: "top-right",
        message: `${props.entityName} saved successfully`,
      });

      await fetchItems();

      // Emit events for parent component to listen
      if (editedIndex.value === -1) {
        emit("item-created", editedItem.value);
      } else {
        emit("item-updated", editedItem.value);
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

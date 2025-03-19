<template>
  <div class="color-picker-field">
    <v-text-field
      v-model="colorValue"
      :label="label"
      :hint="hint"
      :rules="rules"
      :placeholder="placeholder"
      :readonly="readonly"
      @input="onInput"
      variant="outlined"
    >
      <template v-slot:append>
        <div class="d-flex align-center">
          <div
            class="color-preview mr-2"
            :style="{ backgroundColor: colorValue }"
          ></div>
          <v-menu v-model="menu" :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" @click="menu = true">
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-color-picker
                  v-model="colorValue"
                  hide-inputs
                  mode="hex"
                  @input="onColorSelect"
                  flat
                ></v-color-picker>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="menu = false"> Cancel </v-btn>
                <v-btn color="primary" text @click="confirmColor"> OK </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: "ColorPickerField",

  props: {
    value: {
      type: String,
      default: "#fff",
    },
    label: {
      type: String,
      default: "Color",
    },
    hint: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "#RRGGBB",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      colorValue: this.value,
      menu: false,
      tempColor: null,
    };
  },

  watch: {
    value(newValue) {
      this.colorValue = newValue;
    },
  },

  methods: {
    onInput() {
      this.$emit("selectedColor", this.colorValue);
    },

    onColorSelect(color) {
      this.tempColor = color;
    },

    confirmColor() {
      this.colorValue = this.tempColor || this.colorValue;
      this.$emit("selectedColor", this.colorValue);
      this.menu = false;
    },
  },
};
</script>

<style scoped>
.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

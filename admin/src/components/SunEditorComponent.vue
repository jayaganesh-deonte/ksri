<template>
  <div class="sun-editor-container">
    <div class="text-secondary text-end">
      * Add max of 1 image to editor under 50KB of size
    </div>
    <div class="text-secondary text-end">Words: {{ wordCount }}</div>
    <div ref="suneditorElement"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, watch, ref } from "vue";
import SunEditor from "suneditor";
import "suneditor/dist/css/suneditor.min.css";

// Import SunEditor plugins if needed
import plugins from "suneditor/src/plugins";

export default defineComponent({
  name: "SunEditorComponent",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "300px",
    },
    toolbar: {
      type: String,
      default: "essential",
    },
    contentType: {
      type: String,
      default: "html",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const suneditorElement = ref(null);
    const wordCount = ref(0);
    let editor = null;

    const toolbarOptions = {
      essential: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["removeFormat"],
        ["fontColor", "hiliteColor"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "table"],
        ["link", "image", "video"],
        ["fullScreen", "showBlocks", "codeView"],
      ],
    };

    const countWords = (text) => {
      const strippedText = text.replace(/<[^>]*>/g, " ").trim();
      return strippedText.split(/\s+/).filter((word) => word.length > 0).length;
    };

    onMounted(() => {
      initEditor();
    });

    onBeforeUnmount(() => {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    });

    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor && newValue !== editor.getContents()) {
          editor.setContents(newValue);
          wordCount.value = countWords(newValue);
        }
      }
    );

    const initEditor = () => {
      editor = SunEditor.create(suneditorElement.value, {
        height: props.height,
        buttonList: toolbarOptions[props.toolbar] || toolbarOptions.essential,
        plugins: plugins, // Add plugins if needed
        // Set a default format
        defaultTag: "p",
        // Set a default font size
        defaultStyle: "font-size: 14px;",
      });

      // Set initial content
      if (props.modelValue) {
        editor.setContents(props.modelValue);
        wordCount.value = countWords(props.modelValue);
      }

      // Add event handlers
      editor.onChange = (content) => {
        emit("update:modelValue", content);
        wordCount.value = countWords(content);
      };
    };

    return {
      suneditorElement,
      wordCount,
    };
  },
});
</script>

<style scoped>
.sun-editor-container {
  width: 100%;
}
</style>

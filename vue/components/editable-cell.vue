<template>
  <div class="editable-cell">
    <component
      :is="inputComponent"
      v-if="editable || showInput"
      v-model="inputValue"
      :editable="editable"
      :tips="tips"
      v-bind="$attrs"
      @input="onUpdate"
      @change="onUpdate"
      v-on="$listeners"
    >
      <slot name="input-content" />
    </component>
    <slot v-else-if="!editable && !showInput" />
  </div>
</template>

<script>
import DynamicInput from  './dynamic-input';
import EditableSelect from './editable-select';

export default {
  name: 'EditableCell',
  components: {
    DynamicInput,
    EditableSelect
  },
  props: {
    value: [Object, Array, Date, Number, String, Boolean, Symbol],
    inputComponent: {
      type: String,
      default: 'el-input',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputValue: this.value,
    };
  },
  watch: {
    value () {
      this.inputValue = this.value;
    },
  },
  methods: {
    onUpdate () {
      this.$emit('input', this.inputValue);
      this.$emit('change', this.inputValue);
    },
  },
};
</script>

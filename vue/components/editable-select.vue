<template>
  <div
    class="editable-select"
    :class="[sizeClass]"
  >
    <el-select
      v-if="editable"
      v-model="selected"
      class="editable-select__input"
      :style="{ width: `${validInputWidth}px` }"
      :size="validSize"
      :placeholder="placeholder"
      v-bind="selectOption"
      multiple
      clearable
      filterable
      @change="onUpdate"
    >
      <el-option
        v-for="op in options"
        :key="op[props.value]"
        :label="op[props.label]"
        :value="op[props.value]"
      />
    </el-select>
    <span v-else>{{ viewText }}</span>
  </div>
</template>

<script>
export default {
  name: 'EditableSelect',
  props:  {
    value: {
      type: [String, Number, Boolean, Array],
      default: '',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'mini',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    props: {
      type: Object,
      default: () => ({
        value: 'value',
        label: 'label',
      }),
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    formatter: {
      type: Function,
      default: null,
    },
    selectOption: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    let selected = '';
    if (this.multiple) {
      if (!Array.isArray(this.value)) {
        selected = [];
      }
    }

    return {
      selected,
    };
  },
  computed: {
    sizeClass () {
      switch (this.size) {
        case 'small':
          return 'editable-select--small';
        case 'mini':
          return 'editable-select--mini';
        default:
          return '';
      }
    },
    validSize () {
      return this.selectOption?.size || this.size;
    },
    validInputWidth () {
      switch (this.size) {
        case 'small':
          return 200;
        case 'mini':
        default:
          return 180;
      }
    },
    viewText () {
      if (this.formatter) {
        return this.formatter(this.selected);
      }
      return this.selected;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.selected = this.value;
      },
    },
  },
  methods: {
    onUpdate () {
      this.$emit('input', this.selected);
      this.$emit('change', this.selected);
    }
  },
};
</script>

<style lang="scss" scoped>
.editable-select {
  display: inline-block;

  &--small {
    font-size: 14px;
  }

  &--mini {
    font-size: 12px;
  }
}
</style>
<template>
  <div class="checkbox-group">
    <el-checkbox
      v-if="showCheckAll"
      v-model="checkAll"
      class="checkbox-group__all"
      :indeterminate="indeterminate"
      :disabled="checkAllDisabled"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-if="options.length"
      v-model="checkedList"
      class="checkbox-group__group"
      :disabled="groupDisabled"
      @change="handleChecked"
    >
      <el-checkbox
        v-for="option in options"
        :key="option[optionField.value]"
        :label="option[optionField.value]"
        :disabled="Boolean(option.disabled)"
        class="checkbox-group__checkbox"
        :style="checkboxStyle"
      >
        {{ option[optionField.label] }}
      </el-checkbox>
    </el-checkbox-group>
    <p v-else class="checkbox-group__empty">无数据</p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [/*{
        [optionField.value]: string|number|boolean,
        [optionField.label]: string,
        disabled: boolean,
      }*/],
    },
    optionField: {
      type: Object,
      default: () => ({
        value: 'value',
        label: 'label',
      }),
    },
    showCheckAll: {
      type: Boolean,
      default: true,
    },
    checkAllDisabled: {
      type: Boolean,
      default: false,
    },
    groupDisabled: {
      type: Boolean,
      default: false,
    },
    checkboxStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      checkAll: false,
      indeterminate: false,
      checkedList: [],
    };
  },
  computed: {
    valueOptions () {
      return this.options.map(v => v[this.optionField.value]);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler (v) {
        this.checkedList = v;
        this.changeCheckAllStatus(v);
      },
    },
    options () {
      this.changeCheckAllStatus(this.checkedList);
    },
  },
  methods: {
   handleCheckAllChange(value) {
      this.checkedList = value ? this.valueOptions : [];
      this.indeterminate = false;

      this.updateValue();
    },
    handleChecked(value) {
      this.changeCheckAllStatus(value);
      this.updateValue();
    },
    changeCheckAllStatus (value) {
      if (this.options.length) {
        this.checkAll = value.length === this.options.length;
        this.indeterminate = value.length > 0 && value.length < this.options.length;
      }
      else {
        this.checkAll = false;
        this.indeterminate = false;
      }
    },
    updateValue () {
      this.$emit('input', this.checkedList);
      this.$emit('change', this.checkedList);
    },
  }
};
</script>

<style lang="scss" scoped>
.checkbox-group {
  &__empty {
    text-align: center;
    color: #909399;
  }

  ::v-deep .el-checkbox__label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
}
</style>

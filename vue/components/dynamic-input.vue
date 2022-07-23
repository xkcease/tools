<template>
  <div
    class="dynamic-input"
    :class="[sizeClass]"
  >
    <el-form v-if="editable" :model="form" ref="form">
      <el-form-item
        v-for="(item, index) of form.list"
        :key="index"
        :prop="`list.${index}`"
        :rules="validRules"
        class="dynamic-input__item"
      >
        <el-input
          class="dynamic-input__input"
          :style="{ width: `${validInputWidth}px` }"
          :size="validSize"
          v-model="form.list[index]"
          v-bind="option"
          @input="onUpdate"
          @change="onUpdate"
        />
        <div class="dynamic-input__icon--wrap">
          <i
            v-if="form.list.length > 1"
            class="dynamic-input__icon dynamic-input__remove el-icon-remove-outline"
            @click="removeInput(index)"
          />
          <i
            v-if="index === form.list.length - 1"
            class="dynamic-input__icon dynamic-input__add el-icon-circle-plus-outline"
            @click="addInput"
          />
        </div>
      </el-form-item>
    </el-form>
    <ul v-else class="dynamic-input__view">
      <li
        v-for="(item,index) of form.list"
        :key="index"
        class="dynamic-input__tag--wrap"
      >
        <el-tag v-if="effect === 'tag'" class="dynamic-input__tag">{{ item }}</el-tag>
        <span v-else class="dynamic-input__tag">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DynamicInput',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    editable: {
      type: Boolean,
      default: true,
    },
    effect: {
      type: String,
      default: 'tag',
    },
    size: {
      type: String,
      default: 'mini',
    },
    option: Object,
    rule: Object,
  },
  data () {
    return {
      form: {
        list: this.value,
      }
    };
  },
  computed: {
    validRules () {
      if (this.rule) {
        return {
          trigger: this.rule.trigger,
          validator: (rule, value, callback) => {
            const rs = this.rule.validator(value); // 返回结果 => { result: Boolean, message: String }
            if (!rs.result) {
              return callback(new Error(rs.message));
            }
            callback();
          },
        };
      }
      else if (this.option) {
        return this.option.rules;
      }
      else {
        return {};
      }
    },
    sizeClass () {
      switch (this.size) {
        case 'small':
          return 'dynamic-input--small';
        case 'mini':
          return 'dynamic-input--mini';
        default:
          return '';
      }
    },
    validSize () {
      if (this.option.size) {
        return this.option.size;
      }
      return this.size;
    },
    validInputWidth () {
      switch (this.size) {
        case 'small':
          return 235;
        case 'mini':
        default:
          return 220;
      }
    },
  },
  watch: {
    value () {
      this.form.list = this.value;
    },
    editable (v) {
      if (!v) { // 显示标签时, 过滤空元素和非规则数据; 过滤非规则数据仅支持自定义规则;
        let list = [];

        list = this.form.list.filter(v => v);
        if (this.rule) {
          list = list.filter(v => this.rule.validator(v).result);
        }

        this.form.list = list;
        this.onUpdate();
      }
    },
  },
  created () {
    if (!this.form.list.length) {
      this.form.list.push('');
    }
  },
  methods: {
    onUpdate () {
      this.$emit('input', this.form.list);
      this.$emit('change', this.form.list);
    },
    addInput () {
      this.form.list.push('');
      this.onUpdate();
    },
    removeInput (index) {
      if (this.form.list.length > 1) {
        if (Reflect.has(this.form.list, index)) {
          this.form.list.splice(index, 1);
        }
        this.onUpdate();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dynamic-input {
  &__item {
    margin-bottom: 2px;
    position: relative;
  }

  &__view {
    padding: 0;
    list-style: none;
  }

  &__icon {
    &--wrap {
      display: inline-block;
      position: absolute;
      margin-left: 4px;
    }

    vertical-align: middle;
    font-size: 18px;
  }

  &--small {
    font-size: 14px;
  }

  &--mini {
    font-size: 12px;
  }

  &__add {
    color: #67C23A;
  }

  &__remove {
    color: #F56C6C;
  }

  &__tag {
    &--wrap {
      margin-bottom: 2px;
    }
  }
}

.el-form ::v-deep .el-form-item__error {
  position: static;
}
</style>
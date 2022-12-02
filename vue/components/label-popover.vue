<template>
  <div class="label-popover">
    <span>{{ label }}</span>
    <el-popover
      v-if="showPopover"
      trigger="hover"
      placement="right"
      :content="content"
      v-bind="$attrs"
    >
      <template #reference>
        <div class="label-popover__badge" :style="badgeStyle">
          <slot>
            <i class="el-icon-question" />
          </slot>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'LabelPopover',
  props: {
    label: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    badgeStyle: {
      type: Object,
      default: () => {},
    },
    showPopover: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.label-popover {
  display: inline-block;
  position: relative;

  &__badge {
    color: #909399;
    position: absolute;
    right: -10px;
    top: -8px;
    font-size: 12px;
  }
}
</style>

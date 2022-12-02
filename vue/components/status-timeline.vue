<template>
  <el-timeline class="status-timeline">
    <el-timeline-item
      v-for="(step, index) in timeline"
      :key="index"
      size="large"
      placement="top"
      :icon="step.icon"
      :type="step.type"
      :timestamp="step.title"
    >
      <span class="status-timeline__content" :style="step.style">{{ step.content }}</span>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  name: 'StatusTimeline',
  props: {
    initialQueue: {
      type: Array,
      default: () => [/*
        title: String,      // 阶段标题
        content: String,    // 初始描述
        endContent: String, // 阶段结束描述
      */],
    },
  },
  data () {
    const STATUS = {
      ready: 'ready',
      processing: 'processing',
      suspend: 'suspend',
      error: 'error',
      success: 'success',
      terminated: 'terminated',
    };

    return {
      queue: this.initialQueue || [],
      timeline: [],
      currentIndex: 0,
      status: STATUS.ready,
      STATUS,
    };
  },
  computed: {
    currentStep () {
      return this.timeline[this.currentIndex];
    },
    isRunning () {
      return [
        this.STATUS.processing,
      ].includes(this.status);
    },
    isEnd () {
      return [
        this.STATUS.error,
        this.STATUS.success,
        this.STATUS.terminated,
      ].includes(this.status);
    },
    isException () {
      return [
        this.STATUS.error,
        this.STATUS.terminated,
      ].includes(this.status);
    },
  },
  watch: {
    status (v) {
      this.$emit('update:status', v);
    },
    isRunning (v) {
      this.$emit('is-running', v);
    },
    isEnd (v) {
      this.$emit('is-end', v);
    },
    isException (v) {
      this.$emit('is-exception', v);
    },
  },
  created () {
    this.timeline = this.queue.map(item => this._createInitialStep(item));
  },
  methods: {
    push (...items) {
      this.queue.push(...items);
      this.timeline.push(...items.map(items => this._createInitialStep(items)));
    },
    start () {
      this._initStep();
      this.status = this.STATUS.processing;
    },
    info (content, options) {
      if (!this._check()) {
        return;
      }

      this._updateStep({
        content,
        type: 'primary',
        icon: 'el-icon-loading',
        style: 'color: #409EFF',
        ...options,
      });
    },
    warn (content, options) {
      if (!this._check()) {
        return;
      }

      this._updateStep({
        content,
        type: 'warning',
        icon: 'el-icon-warning',
        style: 'color: #E6A23C',
        ...options,
      });
    },
    error (content, options, remainStepOptions) {
      if (!this._check()) {
        return;
      }

      this._updateStep({
        content: content || '错误',
        type: 'danger',
        icon: 'el-icon-close',
        style: 'color: #F56C6C',
        ...options,
      });

      // 中止剩余步骤
      if (remainStepOptions && remainStepOptions.length) {
        this._updateRemainingStepBySingle(remainStepOptions);
      }
      else {
        this._updateRemainingStepByWhole({
          content: '已取消',
        });
      }
      this.currentIndex = this.timeline.length;

      this.end(this.STATUS.error);
    },
    next (content, options) {
      if (!this._check()) {
        return;
      }

      this._updateStep({
        content: content || this.currentStep.endContent || '成功',
        type: 'success',
        icon: 'el-icon-check',
        style: 'color: #67C23A',
        ...options,
      });

      this.currentIndex++;

      // 初始化下一步
      if (this.currentIndex < this.timeline.length) {
        this._initStep();
      }
      else {
        // 成功结束
        this.end(this.STATUS.success);
      }
    },
    end (status) {
      if (!this._check()) {
        return;
      }

      // 因故中止
      if (this.currentIndex < this.timeline.length) {
        this._updateRemainingStep({
          content: '中止',
        });
        this.currentIndex = this.timeline.length;
      }

      this.status = status || this.STATUS.terminated;
    },
    _check () {
      return this.isRunning;
    },
    _createInitialStep (item, options) {
      return {
        ...item,
        content: item.content || '等待中',
        icon: 'el-icon-loading',
        ...options,
      };
    },
    _initStep (options, index = this.currentIndex) {
      this._updateStep({
        content: '',
        type: 'primary',
        icon: 'el-icon-loading',
        style: 'color: #409EFF',
        ...options,
      }, index);
    },
    _updateStep (options, index = this.currentIndex) {
      Object.assign(this.timeline[index], options);
    },
    _updateRemainingStepByWhole (options) {
      for (let index = this.currentIndex + 1; index < this.timeline.length; index++) {
        this._updateStep(options, index);
      }
    },
    _updateRemainingStepBySingle (remainStepOptions) {
      let optionIndex = 0;
      for (let index = this.currentIndex + 1; index < this.timeline.length; index++) {
        this._updateStep(remainStepOptions[optionIndex] || { content: '已取消' }, index);
        optionIndex++;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.status-timeline {
  &__content {
    white-space: pre-wrap;
  }
}
</style>

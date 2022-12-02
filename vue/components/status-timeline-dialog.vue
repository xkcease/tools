<template>
  <el-dialog
    class="status-timeline-dialog"
    width="700px"
    :title="titleMapping[status]"
    :visible.sync="show"
    :show-close="false"
    center
  >
    <status-timeline
      ref="statusTimeline"
      :initial-queue="initialQueue"
      @update:status="status = $event"
      @is-end="isEnd = $event"
      @is-exception="isException = $event"
    />
    <template v-if="isEnd" #footer>
      <el-button v-if="isException" type="danger" @click="close">关闭</el-button>
      <slot v-else name="footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
import StatusTimeline from './status-timeline';

export default {
  name: 'StatusTimelineDialog',
  components: {
    StatusTimeline,
  },
  props: {
    initialQueue: {
      type: Array,
      default: () => [/*
        title: String,      // 阶段标题
        content: String,    // 初始描述
        endContent: String, // 阶段结束描述
      */],
    },
    statusTitles: {
      type: Object,
      default: () => ({/*
        ready: String,
        processing: String,
        suspend: String,
        error: String,
        success: String,
        terminated: String,
      */}),
    },
  },
  data () {
    return {
      show: false,
      title: '',
      isEnd: false,
      isException: false,
      status: 'ready',
    };
  },
  computed: {
    titleMapping () {
      return Object.assign({
        ready: '就绪',
        processing: '进行中',
        suspend: '暂停',
        error: '错误',
        success: '成功',
        terminated: '中止',
      }, this.statusTitles);
    },
  },
  methods: {
    open () {
      this.show = true;
    },
    close () {
      this.show = false;
    },
    _invoke (name, ...args) {
      this.$nextTick(() => {
        if (this.$refs.statusTimeline?.[name]) {
          this.$refs.statusTimeline[name](...args);
        }
      });
    },
    push (...items) {
      this._invoke('push', ...items);
    },
    start () {
      if (!this.show) {
        this.open();
      }

      this._invoke('start');
    },
    info (content, options) {
      this._invoke('info', content, options);
    },
    warn (content, options) {
      this._invoke('warn', content, options);
    },
    error (content, options, remainStepOptions) {
      this._invoke('error', content, options, remainStepOptions);
    },
    next (content, options) {
      this._invoke('next', content, options);
    },
  },
};
</script>

<template>
  <div class="simple-upload">
    <el-upload
      ref="upload"
      class="simple-upload__upload"
      :action="action"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploaded"
    >
      <div v-if="imgUrl" class="simple-upload__block">
        <img :src="imgUrl" class="simple-upload__pic">
        <i class="el-icon-error simple-upload__remove" @click.stop="handleRemoveFile" />
      </div>
      <i v-else class="el-icon-plus simple-upload__add" />
    </el-upload>
    <div v-if="showTip">
      <ul class="simple-upload__tips">
        <li
          v-for="(tip, index) in tips"
          :key="index"
          class="simple-upload__tip"
        >
          <i class="el-icon-info" />
          <span
            v-for="(t, i) in tip"
            :key="i"
            :style="t.style"
            :class="`${t.type ? `simple-upload__${t.type}`: '' }`"
          >
            {{ t.text }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleUpload',
  props: {
    name: {
      type: String,
      default: 'default',
    },
    action: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    beforeUpload: {
      type: Function,
      default () {},
    },
    maxSize: {
      type: String,
      default: '', // 带单位 G, M, K;
    },
    showTip: {
      type: Boolean,
      default: true,
    },
    tips: {
      type: Array,
      default: () => [/*
        [
          {
            text: '文件需小于3M',
            style: { fontSize: '12px' },
            type: 'emphasis', // 内部样式; 目前仅支持 emphasis
          },
        ]
      */],
    },
  },
  data () {
    return {
      imgUrl: '',
    };
  },
  watch: {
    imgSrc: {
      immediate: true,
      handler (v) {
        this.imgUrl = v;
      },
    },
  },
  methods: {
    unitToNumber (unit) {
      const ms = /(\d+)\s*([kmgb]+)?/i.exec(unit);
      if (ms) {
        let r = 0;
        switch ((ms[2]||'').toUpperCase()) {
          case 'K':
          case 'KB': r = 10; break;
          case 'M':
          case 'MB': r = 20; break;
          case 'G':
          case 'GB': r = 30; break;
        }
        return (parseInt(ms[1]) || 0) << r;
      }
      else {
        return 0;
      }
    },
    handleBeforeUpload (file) {
      if (this.maxSize) {
        if (file.size > this.unitToNumber(this.maxSize)) {
          this.$message.error(`文件大小不能超过${this.maxSize}`);
          return false;
        }
      }

      this.imgUrl = URL.createObjectURL(file);
      this.$emit('update:img-src', this.imgUrl);

      return this.beforeUpload(file, this.name);
    },
    handleUploaded (res) {
      if (res.code === 0) {
        this.$emit('success', res.result, this.name);
      }
      else {
        this.$message.error(res.message);
      }
    },
    handleRemoveFile () {
      this.$refs.upload.clearFiles();
      this.imgUrl = '';

      this.$emit('update:img-src', this.imgUrl);
      this.$emit('remove', this.name);

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-upload {
  &__upload {
    width: 180px;
    height: 180px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
  }

  &__block {
    position: relative;
  }

  &__remove {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 24px;
    color: #F56C6C;
    z-index: 8;
  }

  &__pic {
    width: 180px;
    height: 180px;
  }

  &__add {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    line-height: 180px;
  }

  &__tips {
    list-style: none;
    padding-left: 0;
  }

  &__tip {
    color: #909399;
    font-size: 12px;
    line-height: 18px;
  }

  &__emphasis {
    color: #303133;
    font-weight: bold;
  }
}
</style>
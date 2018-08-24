<template>
  <Modal v-model="openModal" :mask-closable="false" :title="title" @on-cancel="cancel" width="400">
    <slot name="content"></slot>
    <div slot="footer">
      <Button @click.native="cancel">取消</Button>
      <Button type="primary" @click.native="ok">保存</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    modal: {
      type: Boolean,
      default: ""
      // default: this.openModal
    }
  },
  data() {
    return {
      openModal: this.modal
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    ok() {
      this.$emit("ok");
    }
  },
  watch: {
    modal(val) {
      this.openModal = val;
    }
  }
};
</script>


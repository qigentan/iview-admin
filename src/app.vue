<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: this.$store.state.app.themeColor
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
.module .ivu-input {
  height: 25px !important;
}
.ivu-modal-footer {
  border: none;
}
/* .module .ivu-form-item {
  margin-bottom: 0 !important;
}
.module .ivu-form-item-content {
  line-height: 25px !important;
} */
</style>

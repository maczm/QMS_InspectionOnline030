<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}

// 添加确认弹窗样式 - 使其居中且不要太大
.my-message-box {
  width: 300px !important;
  margin: 0 auto !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  max-width: 90vw;

  &.el-message-box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%) !important;
  }
}

.el-input.is-disabled .el-input__inner {
  color: #0a0a0a !important;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #409eff !important;
}

.problem-section {
  .el-input {
    .el-input__inner {
      //font-size: 20px !important;
    }
  }

  .problem-label {
    font-size: 0.4rem !important;
    width: 2rem !important;
    margin-bottom: 2px !important;
  }

  .problem-item {
    margin-bottom: 2px !important;
    padding: 2px !important;
  }
}

.el-textarea.is-disabled .el-textarea__inner {
  color: #0a0a0a !important;
}
</style>

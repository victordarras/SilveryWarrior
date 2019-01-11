<template>
  <section class="logs">

    <transition-group tag="ul" name="listAppear">
      <li
        class="log"
        v-for="log in reverseLogs"
        :class="log.kind"
        :key="log.id"
      >{{ log.content }}</li>
    </transition-group>

  </section>
</template>

<script>
export default {
  name: 'Logger',
  props: {
    logs: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    reverseLogs() {
      return this.logs.slice().reverse();
    }
  }
}
</script>

<style lang="scss" scoped>
.logs {
  grid-area: logs;
  z-index: 1;
  font-size: 16px;
  max-height: 100%;
  overflow: auto;
}
.log {
  margin: 0 0 0.25em 1rem;
  &:nth-child(n + 7) {
    opacity: 0.5;
  }
  &.warning {color: darkorange;}
  &.alert {color: darkred;}
  &.success {color: darkgreen;}
}
</style>

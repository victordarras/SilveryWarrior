<template>
  <section class="logs">

    <transition-group tag="ul" name="listAppear">
      <li
        class="log"
        v-for="log in logs"
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
  display: flex;
  flex-direction: column-reverse;
  font-family: sans-serif;
}
.log {
  margin: 0 0 0.25em 1rem;
  &.warning {color: darkorange;}
  &.alert {color: darkred;}
  &.success {color: darkgreen;}
}
</style>

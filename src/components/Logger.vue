<template>
  <section>
    <transition-group class="logs" tag="ul" name="listAppear" ref="logs">
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
  computed: {
    logs() {
      return this.$store.getters.getLogs;
    }
  },
  updated: function() {
    this.$refs.logs.scrollTop = this.$refs.logs.offsetHeight;
  }
}
</script>

<style lang="scss" scoped>
.logs {
  grid-area: logs;
  z-index: 1;
  font-size: 0.625rem;
  padding: 10vh 2vh 0;
  // max-height: 19vh;
  overflow: auto;
  display: flex;
  flex-flow: column;
  flex-direction: column-reverse;
  font-family: sans-serif;
}
.log {
  margin: 0 0 0.25em;
  &.warning {color: darkorange;}
  &.alert {color: darkred;}
  &.success {color: darkgreen;}
}
</style>

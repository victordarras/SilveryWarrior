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
@import '../assets/variables';

.logs {
  @include sans-serif;
  font-size: 0.75rem;
  padding: 2vh;
  height: 24vh;
  overflow: auto;
  display: flex;
  flex-flow: column;
  text-align: left;
  margin-bottom: 2vh;
  background-color: #eee;
  color: #555;
}
.log {
  margin: 0 0 0.25em;
  &.warning {color: darkorange;}
  &.alert {color: darkred;}
  &.success {color: darkgreen;}
}
</style>

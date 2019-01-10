<template>
  <section class="logs">

    <transition-group tag="ul" name="listAppear">
      <li class="log" v-for="log in reverseLogs" :key="log.id">{{ log.content }}</li>
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

<style scoped>
.logs {
  grid-area: logs;
  font-size: 21px;
}
.log {
  margin: 0 0 0.25em 1rem ;
}
</style>

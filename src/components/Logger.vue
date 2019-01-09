<template>
  <section class="logs">
    <ul>
      <li v-for="(log, i) in logs" :key="i"><code>{{ log }}</code></li>
    </ul>
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
  }
}
</script>

<style scoped>
.logs {
  grid-area: logs;
}
.logs li:first-child {  opacity: 1}
.logs li:nth-child(2) { opacity: 0.7}
.logs li:nth-child(3) { opacity: 0.6}
.logs li {  opacity: 0.5}
</style>

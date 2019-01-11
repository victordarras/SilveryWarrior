<template>
  <div class="city">
    <button @click="sleep">Dormir à l'auberge (Vie max. gratuit)</button>
  </div>
</template>

<script>
export default {
  name: 'Place',
  props: {
    cell: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    sleep() {
      this.$emit('sleep');
    }
  }
}
</script>

<style lang="scss" src="../assets/city.scss" scoped></style>

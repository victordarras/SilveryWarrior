<template>
  <div class="city">

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
  }
}
</script>

<style lang="scss" src="../assets/city.scss" scoped></style>

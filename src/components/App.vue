<template>
  <main>
    <!-- <nav class="Navigation">
      <router-link to="/game">GAME</router-link>
      <div class="admin-hr"></div>
      <router-link to="/mob-editor">MOBS</router-link>
      <router-link to="/item-editor">ITEMS</router-link>
      <router-link to="/map-editor">MAP</router-link>
    </nav> -->
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('loadMobs');
    this.$store.dispatch('loadCells');
  }
}
</script>

<style lang="scss" src="../assets/style.scss"></style>

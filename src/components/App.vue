<template>
  <main>
    <router-view></router-view>
    <nav class="Navigation">
      <router-link to="/">GAME</router-link>
      <div class="admin-hr"></div>
      <router-link to="/mob-editor">MOBS</router-link>
      <router-link to="/item-editor">ITEMS</router-link>
      <router-link to="/map-editor">MAP</router-link>
    </nav>
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

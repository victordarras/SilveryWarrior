<template>
  <main>
    <router-view></router-view>
    <nav class="Navigation">
      <router-link to="/">Game</router-link>
      <a @click="logout()">Logout</a>
      <div class="admin-hr">Editors:</div>
      <router-link to="/mob-editor">Mobs</router-link>
      <router-link to="/item-editor">Items</router-link>
      <router-link to="/map-editor">Map</router-link>
    </nav>
  </main>
</template>

<script>
export default {
  name: 'App',
  methods: {
    logout() {
      localStorage.clear();
      window.location = "/"
    }
  },
  created() {
    this.$store.dispatch('loadMobs');
    this.$store.dispatch('loadCells');
  }
}
</script>

<style lang="scss" src="../assets/style.scss"></style>

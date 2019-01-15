<template>
  <main>
    <nav>
      <router-link to="/game">GAME</router-link>
      <div class="admin-hr"></div>
      <router-link to="/mob-editor">MOBS</router-link>
      <router-link to="/item-editor">ITEMS</router-link>
      <router-link to="/map-editor">MAP</router-link>
    </nav>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'App',
  data: () => {
    return {
    }
  }
}
</script>

<style lang="scss" src="../assets/style.scss"></style>
<style lang="scss" scoped>
  nav {
    background: #000;
    color: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #000;
    .admin-hr {
      margin-left: auto;
    }
    a {
      padding: 0.25em 1rem;
      text-decoration: none;
      font-family: sans-serif;
      color: inherit;
      &:hover {
        background-color: #fff;
        color: #000;
      }
    }
  }

</style>

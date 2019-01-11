<template>
  <main>
    <nav>
      <router-link to="/game">GAME</router-link>
      <router-link to="/mob-editor">MOB EDITOR</router-link>
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
    a {
      padding: 0.25em 1rem;
      text-decoration: none;
      font-family: sans-serif;
      color: inherit;
      border-top: 3px solid #000;
      &:hover {
        border-top: 3px solid #fff
      }
    }
  }

</style>

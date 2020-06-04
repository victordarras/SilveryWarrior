<template>
  <section class="Sidebar">
    <div class="Sidebar__avatar">
    </div>
    <h3>{{ player.name }}({{ player.level }})</h3>

    <div class="Sidebar__menu">
      <a
        class="Sidebar__money"
      >{{ player.money }}</a>

      <router-link class="Sidebar__settings" style="float:right" to="/menu"></router-link>
      <a
        @click="$emit('changePage','profile')"
        class="Sidebar__inventory"
        title="Voir mon profil"
      ></a>
      <a
        @click="drinkPotion()"
        class="Sidebar__potion"
        title="Boire une potion de vie"
      >{{ potionsCount }}</a>
    </div>

    <div class="Sidebar__quest"></div>

    <a @click="$emit('logout')" class="button">logout</a>
    <a class="button" @click="$emit('changePage','map')">MAP</a>
    <a class="button" @click="$emit('changePage','equipments')">EQUIPMENTS</a>

  </section>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    player() {
      return this.$store.getters.getPlayer;
    },
    potionsCount() {
      return this.player.items ? this.player.items.filter(item => item.id === "123456789").length : [];
    }
  },
  methods: {
    drinkPotion() {
      const popo = this.player.items.find(item => item.id === "123456789");
      if (popo != undefined) {
        this.$emit('clickItem', popo)
      }
    },
    lifeCss (value, max) {
      const l = (value / max) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    }
  }
}
</script>

<style lang="scss" src="../assets/sidebar.scss" scoped></style>

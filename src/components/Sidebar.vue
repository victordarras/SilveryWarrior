<template>
  <section class="Sidebar">
    <div class="Sidebar__avatar">
      <div class="Sidebar__life" :style="lifeCss(player.currentLife, player.life)">
        <span class="Sidebar__lifeValue"><strong>{{ player.currentLife }}</strong>/{{ player.life }}</span>
      </div>
    </div>
    <h3>{{ player.name }}({{ player.level }})</h3>

    <div class="Sidebar__menu">
      <a
        class="Sidebar__money"
      >{{ player.money }}</a>
      <a
        class="Sidebar__settings"
      ></a>
      <a
        @click="$emit('showProfile')"
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

    <div @click="$emit('logout')" class="button">logout</div>
  </section>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    player: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    potionsCount() {
      return this.player.items.filter(item => item.id === "123456789").length;
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

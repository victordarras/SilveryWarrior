<template>
  <section class="sidebar">
    <div class="profile">
      <div class="profile-avatar">
        <div class="lifeBar" :style="lifeCss(player.currentLife, player.life)">
          <span class="lifeBar-value"><strong>{{ player.currentLife }}</strong>/{{ player.life }}</span>
        </div>
      </div>
      <h3>{{ player.name }}({{ player.level }})</h3>
      <p>
        {{ player.money }} 💰<br>
        {{ player.exp }} experience points<br>
        {{ player.kills }} mob killed
      </p>
      <div class="profile-menu">
        <a class="profile-money"></a>
        <a class="profile-settings"></a>
        <a @click="$emit('showProfile')" class="profile-inventory"></a>
        <a @click="drinkPotion()" class="profile-drink"></a>
      </div>
      <div class="profile-quest"></div>
    </div>
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
  methods: {
    drinkPotion() {
      const popo = this.player.items.find(item => item.id === "123456789")
      if (popo != undefined) {
        return this.useItem(popo);
      }
    },
    useItem(item) {
      return this.$emit('useItem', item);
    },
    lifeCss (value, max) {
      const l = (value / max) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    }
  }
}
</script>

<style lang="scss" src="../assets/sidebar.scss" scoped></style>

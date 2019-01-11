<template>
  <section class="profile">
    <div class="profile-avatar">
      <div class="lifeBar" :style="lifeCss(player.currentLife, player.life)">
        <span class="lifeBar-value"><strong>{{ player.currentLife }}</strong>/{{ player.life }}</span>
      </div>
    </div>
    <h3>{{ player.name }}({{ player.level }})</h3>
    <p>
      {{ player.exp }} experience points<br>
      {{ player.kills }} mob killed
    </p>
    <div class="profile-menu">
      <a class="profile-money"></a>
      <a class="profile-settings"></a>
      <a class="profile-inventory"></a>
      <a @click="drinkPotion()" class="profile-drink"></a>
    </div>
    <div class="profile-quest"></div>
  </section>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    player: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    drinkPotion() {
      this.$emit('drinkPotion');
    },
    lifeCss (value, max) {
      const l = (value / max) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    }
  }
}
</script>

<style lang="scss" src="../assets/profile.scss" scoped></style>

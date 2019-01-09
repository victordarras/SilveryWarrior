<template>
  <section class="profile">
    <div class="profile-avatar">
      <div class="lifeBar" :style="lifeCss(player.currentLife, player.life)">
        <span class="lifeBar-value"><strong>{{ player.currentLife }}</strong>/{{ player.life }}</span>
      </div>
    </div>
    <h3>{{ player.name }}</h3>
    <div class="profile-menu">
      <div class="profile-money"></div>
      <div class="profile-settings"></div>
      <div class="profile-inventory"></div>
      <div class="profile-drink"></div>
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
    lifeCss: (value, max) => {
      const l = (value / max) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    }
  }
}
</script>

<style lang="scss" src="../assets/profile.scss" scoped></style>

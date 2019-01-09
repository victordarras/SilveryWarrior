<template>
  <section class="profile">
    <div class="profile-avatar">
      <div class="lifeBar" :style="lifeCss(player.life)">
        <strong>{{ player.life }}</strong> /100
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
  name: 'Place',
  props: {
    player: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    lifeCss: function (l) {
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, white ${l}%, white )`
    }
  }
}
</script>

<style scoped>
.profile {
  grid-row: span 2;
}

.profile-menu {
  width: 196px;
  height: 184px;
  background: url(../assets/images/profile_menu.png) no-repeat center / contain;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  cursor: pointer;
}

.profile-quest {
  width: 180px;
  height: 100px;
  background: url(../assets/images/profile_quests.png) no-repeat center / contain;
}

.profile-avatar {
  position: relative;
  width: 200px;
  height: 200px;
  background: url(../assets/images/profile_avatar.png) no-repeat center / contain;
}

.lifeBar {
  position: absolute;
  top: 150px;
  left: 35px;
  right: 53px;
  height: 15px;
  border-radius: 15px;
  color: #fff;
  text-align: center;
}
</style>

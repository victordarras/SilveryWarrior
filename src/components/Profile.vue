<template>
  <section class="profile">
    <div class="profile-avatar">
      <div class="lifeBar" :style="lifeCss(player.life)">
        <span class="lifeBar-value"><strong>{{ player.life }}</strong> /100</span>
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
  padding: 20px 40px;
  position: relative;
  grid-area: profile;
}

.profile:before {
  content:"";
  position: absolute;
  /*33*585*/
  width: 33px;
  height: 100%;
  top: 0;
  right: -15px;
  background: url(../assets/images/vertical_separator.png) repeat-y top right / contain;
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
  height: 14px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lifeBar-value {
  mix-blend-mode: difference;
  color: #fff;
  font-size: 0.875em;
  vertical-align: top;
}
</style>

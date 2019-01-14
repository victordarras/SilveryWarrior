<template>
  <section class="profile">
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
      <a class="profile-inventory"></a>
      <a @click="drinkPotion()" class="profile-drink"></a>
    </div>
    <div class="profile-quest"></div>

    <div class="item">
      <div class="item" v-for="(items, i) in stackedItems" :key="i">
        <button @click="useItem(items[0])">Utiliser</button>
        {{ items.length }} {{ items[0].name }} {{items[0].effects}}
      </div>
    </div>

  </section>
</template>

<script>
import { groupBy } from "../helpers.js"

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
      return this.$emit('drinkPotion');
    },
    useItem(item) {
      return this.$emit('useItem', item);
    },
    lifeCss (value, max) {
      const l = (value / max) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    }
  },
  computed: {
    stackedItems() {
      return this.player.items ? groupBy(this.player.items, "name") : []
    }
  }
}
</script>

<style lang="scss" src="../assets/profile.scss" scoped></style>

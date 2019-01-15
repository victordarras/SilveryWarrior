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
        <a class="profile-inventory"></a>
        <a @click="drinkPotion()" class="profile-drink"></a>
      </div>
      <div class="profile-quest"></div>
    </div>

    <div class="items">
      <div class="item" v-for="(stack, i) in stackedItems" :key="i">
        <div class="hasTooltip" :tooltip="stack[0].effects"></div>
        <button @click="useItem(stack[0])">Utiliser</button>
        {{ stack.length }} {{ stack[0].name }}
      </div>
    </div>

  </section>
</template>

<script>
import { groupBy } from "../helpers.js"

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

<style lang="scss" src="../assets/sidebar.scss" scoped></style>

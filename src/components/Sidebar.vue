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

    <div class="items">
      <div class="item button" v-for="(stack, i) in stackedItems" :key="i" @click="useItem(stack[0])">
        <div class="hasTooltip" :tooltip="stack[0].effects"></div>
        <div class="picture">{{ stack[0].picture }} </div>
        <div class="name">
          {{ stack[0].name }} <span class="item-length">({{ stack.length }})</span>
        </div>
      </div>
    </div>
    <div @click="$emit('logout')" class="button">logout</div>

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
      const popo = this.player.items.find(item => item.id === "123456789")
      if (popo != undefined) {
        return this.useItem(popo)
      }
    },
    useItem(item) {
      if (item.kind === "consumable") {
        return this.$emit('useItem', item);
      }
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

<template>
  <section>
    <img src="../assets/images/Profile.png" alt="">
    <h1>Fiche de personnage :<br/>{{ player.name }}</h1>
    <dl>
      <dt>Attaque:</dt>
      <dd>{{ player.atk }}</dd>
      <dt>Défense:</dt>
      <dd>{{ player.def }}</dd>
      <dt>Vitesse:</dt>
      <dd>{{ player.spe }}</dd>
      <dt>Money:</dt>
      <dd>{{ player.money }}💰</dd>
      <dt>Expérience:</dt>
      <dd>{{ player.exp }}</dd>
    </dl>
    <h2>Inventaire</h2>
    <Inventory
      :items="player.items"
      @clickItem="clickItem"
    />
  </section>
</template>

<script>
import Inventory from "./Inventory";

export default {
  props: {
    player: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    clickItem(item) {
      return this.$emit('clickItem', item);
    }
  },
  components: {
    Inventory
  }
}
</script>

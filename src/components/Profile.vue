<template>
  <section>
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
    <ul class="items">
      <li class="item" v-for="item in player.items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    player: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

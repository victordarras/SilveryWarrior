<template>
  <section class="Profile">
    <header>
      <section>
        <h1>{{ player.name }}</h1>
        <h3>Niveau {{ player.level }}</h3>
      </section>

      <section>
        <h2>Statistiques</h2>
        <dl>
          <dt>Money</dt>
          <dd>💰{{ player.money }}</dd>
          <dt>Expérience</dt>
          <dd>{{ player.exp }}</dd>
          <hr>
          <dt>Attaque</dt>
          <dd>{{ player.atk }}</dd>
          <dt>Défense</dt>
          <dd>{{ player.def }}</dd>
          <dt>Vitesse</dt>
          <dd>{{ player.spe }}</dd>
          <hr>
          <dt>Enemis tués</dt>
          <dd>{{ player.kills }}</dd>
          <dt>Morts</dt>
          <dd>{{ player.death }}</dd>
        </dl>
      </section>
    </header>
    <section>
      <h2>Inventaire</h2>
      <Inventory
        :items="player.items"
        @clickItem="clickItem"
      />
    </section>

    <section>
      <h2>Fiche de personnage</h2>
    </section>
    <!-- <img src="../assets/images/Profile.png" alt=""> -->

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

<style lang="scss" scoped>
  .Profile {
    width: 100%;
  }
  section, dt, dd {
    padding: 0;
    margin: 0;
    vertical-align: top;
    display: inline-block;
    width: 50%;
  }
  dl {
    max-width: 15em;
  }
  dd {
    text-align: right;
  }
  header, section {
    padding: 1em;
  }
</style>

<template>
  <div class="Profile">
    <h2 class="PageTitle">Fiche du joueur</h2>
    <section>
      <h1>{{ player.name }}</h1>
      <h3>Niveau {{ player.level }}</h3>
    </section>

    <h2 class="PageTitle">Statistiques</h2>
    <section>
      <dl>
        <dt>Money</dt>
        <dd>💰{{ player.money }}</dd>
        <dt>Expérience</dt>
        <dd>{{ player.exp }}</dd>
        <hr>
        <dt>Attaque</dt>
        <dd>
          {{ player.atk }} <strong>+{{ equipments.reduce((acc, item) => acc += item.atk, 0) }}</strong>
        </dd>
        <dt>Défense</dt>
        <dd>
          {{ player.def }} <strong>+{{ equipments.reduce((acc, item) => acc += item.def, 0) }}</strong>
        </dd>
        <dt>Vitesse</dt>
        <dd>
          {{ player.spe }} <strong>+{{ equipments.reduce((acc, item) => acc += item.spe, 0) }}</strong>
        </dd>
        <hr>
        <dt>Enemis tués</dt>
        <dd>{{ player.kills }}</dd>
        <dt>Morts</dt>
        <dd>{{ player.death }}</dd>
      </dl>
    </section>

  </div>
</template>

<script>

export default {
  computed: {
    player() {
      return this.$store.getters.getPlayer;
    },
    equipments() {
      return this.player.items.filter(item => item.equiped === true);
    }
  }
}
</script>

<style lang="scss" scoped>
  .Profile {
    width: 100%;
    padding-top: 2rem;
  }
  section {
    padding: 2vh;
  }
  dt, dd {
    padding: 0;
    margin: 0;
    vertical-align: top;
    display: inline-block;
    width: 50%;
  }
  dl {
    max-width: 24em;
  }
  dd {
    text-align: right;
  }
</style>

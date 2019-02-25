<template>
  <div class="Equipments">
    <section class="Equipments--fixed">
      <h2 class="PageTitle">Inventaire</h2>
      <Inventory
        :items="player.items.filter(item => item.equiped !== true)"
        @clickItem="clickItem"
      />
    </section>
    <hr>
    <section>
      <h2 class="PageTitle">Equipement</h2>
      <Inventory
        :items="player.items.filter(item => item.equiped === true)"
        @clickItem="clickItem"
      />
    </section>
  </div>
</template>

<script>
import Inventory from './Inventory'

export default {
  methods: {
    clickItem(item) {
      switch (item.kind) {
        case "equipment":
          if (item.equiped && item.equiped === true) {
            return this.$emit('unequipItem', item);
          }
          item.equiped = true;
          return this.$emit('equipItem', item);
        case "consumable":
          return this.$emit('useItem', item);
        default:
          return this.$emit('clickItem', item);
      }
    }
  },
  computed: {
    player() {
      return this.$store.getters.getPlayer;
    }
  },
  components: {
    Inventory
  }
}
</script>

<style lang="scss" scoped>
  section {
    padding: 2vh;
  }
  .Equipments--fixed {
    padding-top: 3rem;
    overflow-y: auto;
    height: 68vh;
  }
</style>

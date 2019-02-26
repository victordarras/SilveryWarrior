<template>
  <div class="Inventory">
    <section class="Inventory--fixed">
      <h2 class="PageTitle">Inventaire</h2>
      <ItemList
        :items="player.items.filter(item => item.equiped !== true)"
        @clickItem="clickItem"
      />
    </section>
    <section class="Inventory--bottom">
      <h2 class="PageTitle">Equipement</h2>
      <ItemList
        :items="equipments"
        @clickItem="clickItem"
      />
    </section>
  </div>
</template>

<script>
import ItemList from './ItemList'

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
    },
    equipments(){
      return this.player.items.filter(item => item.equiped === true)
    }
  },
  components: {
    ItemList
  }
}
</script>

<style lang="scss" src="../assets/inventory.scss" scoped></style>

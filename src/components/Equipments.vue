<template>
  <div class="Equipments">
    <section class="Equipments--fixed">
      <h2 class="PageTitle">Inventaire</h2>
      <Inventory
        :items="player.items.filter(item => item.equiped !== true)"
        @clickItem="clickItem"
      />
    </section>
    <section class="Equipments--bottom">
      <h2 class="PageTitle">Equipement</h2>
      <Inventory
        :items="equipments"
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
    },
    equipments(){
      return this.player.items.filter(item => item.equiped === true)
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
  .Equipments--bottom {
    position: relative;

    &:after {
      content:"";
      position: absolute;
      /*930x23*/
      height: 23px;
      top: -20px;
      right: -10px;
      left: -15px;
      background: url(../assets/images/horizontal_separator.png) repeat-x top left / contain;
      transform: rotateX(180deg);
    }
  }
  .Equipments--fixed {
    padding-top: 3rem;
    overflow-y: auto;
    height: 72vh;
  }
</style>

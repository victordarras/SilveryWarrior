<template>
  <div class="ItemList">
    <div
      class="Item"
      v-for="(stack, i) in stackedItems"
      :key="i"
      @click="currentItem = stack[0]"
    >
      <span v-if="stack.length > 1" class="Item__count">{{ stack.length }}</span>
      <img class="Item__picture"  :src="`/images/items/${ stack[0].picture }`" />
      <p class="Item__price" v-if="canBuy">{{ stack[0].price }}💰</p>

    </div>

    <div class="Details" v-if="currentItem">
      <div class="Details__content">
        <img class="Item__picture"  :src="`/images/items/${ currentItem.picture }`" />
        <h3>{{ currentItem.name }}</h3>
        <p>Prix : {{currentItem.price}}</p>
        <p>Type : {{currentItem.kind}} {{currentItem.kind === 'equipment' ? currentItem.equipmentKind : ''}}</p>
        <p class="Item__price" v-if="canBuy">{{ currentItem.price }}💰</p>
        <button @click="clickItem(currentItem)">
          <span v-if="canBuy">Acheter</span>
          <span v-else-if="currentItem.kind === 'equipment' && currentItem.equiped">Retirer</span>
          <span v-else-if="currentItem.kind === 'equipment' && !currentItem.equiped">Équiper</span>
          <span v-else-if="currentItem.kind === 'consumable'">Utiliser</span>
          <span v-else>Euh…</span>
        </button>
        <button @click="currentItem = null">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import { groupBy } from "../helpers";

const INVENTORY_SIZE = 30;

export default {
  data() {
    return {
      currentItem: null
    }
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
    canBuy: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    clickItem(item) {
      this.currentItem = null;
      return this.$emit('clickItem', item);
    }
  },
  computed: {
    remainingSlots() {
      var content = [];
      for (var i = INVENTORY_SIZE - Object.keys(this.stackedItems).length; i--; i > 0) {
        content.push("");
      }
      return content;
    },
    stackedItems() {
      return this.items ? groupBy(this.items, "name") : []
    }
  }
}
</script>

<style lang="scss" src="../assets/item-list.scss" scoped></style>

<template>
  <div class="Inventory">
    <div
      class="Item"
      v-for="stack in stackedItems"
      :key="stack[0].id"
      @click="clickItem(stack[0])"
      :title="stack[0].effects"
    >
      <span class="Item__count">{{ stack.length }}</span>
      <div class="Item__picture">{{ stack[0].picture }} </div>
      <div class="Item__name">
        {{ stack[0].name }}
      </div>
      <p v-if="canBuy">Acheter ?<br>({{ stack[0].price }}💰)</p>
    </div>
  </div>
</template>

<script>
import { groupBy } from "../helpers";

export default {
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
      return this.$emit('clickItem', item);
    }
  },
  computed: {
    stackedItems() {
      return this.items ? groupBy(this.items, "name") : []
    }
  }
}
</script>

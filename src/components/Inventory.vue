<template>
  <div class="Inventory">
    <div class="Item button" v-for="(stack, i) in stackedItems" :key="i" @click="clickItem(stack[0])">
      <div class="hasTooltip" :tooltip="stack[0].effects"></div>
      <div class="Item__picture">{{ stack[0].picture }} </div>
      <div class="Item__name">
        <span class="Item__count">{{ stack.length }}</span> {{ stack[0].name }}
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

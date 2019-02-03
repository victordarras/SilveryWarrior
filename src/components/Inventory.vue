<template>
  <div class="items">
    <div class="item button" v-for="(stack, i) in stackedItems" :key="i" @click="clickItem(stack[0])">
      <div class="hasTooltip" :tooltip="stack[0].effects"></div>
      <div class="picture">{{ stack[0].picture }} </div>
      <div class="name">
        {{ stack[0].name }} <span class="item-length">({{ stack.length }})</span>
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

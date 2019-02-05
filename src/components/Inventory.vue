<template>
  <div class="Inventory">
    <div
      class="Item hasTooltip"
      v-for="stack in stackedItems"
      :key="stack[0].id"
      @click="clickItem(stack[0])"
    >
      <span v-if="stack.length > 1" class="Item__count">{{ stack.length }}</span>
      <div class="Item__picture">{{ stack[0].picture }} </div>
      <p v-if="canBuy">Acheter ?<br>({{ stack[0].price }}💰)</p>

      <div class="Tooltip">
        <div class="Tooltip__name">
          {{ stack[0].name }}
        </div>
        <ul class="Tooltip__content">
          <li v-for="effect in stack[0].effects" :key="effect">
            {{ effect }}
          </li>
        </ul>
      </div>
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

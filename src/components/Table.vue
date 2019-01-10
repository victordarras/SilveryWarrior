<template>
  <div class="table">
    <div class="cells">

        <div
          v-for="cell in cells"
          :class="cellClass(cell)"
          :key="cell.uid"
        >
          <div v-if="isReachable(cell)" @click="moveTo(cell.x, cell.y)"></div>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {}
  },
  props: {
    Player: {
      type: Object,
      default: () => ({})
    },
    cells: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    isReachable(cell) {
      if (cell.kind === "unreachable") {
        return false
      }
      const x = cell.x;
      const y = cell.y;
      const p = this.Player;
      if (x === p.x && y === p.y) { return false }
      return (x === p.x && y <= (p.y + 1) && y >= (p.y - 1)) // top & bottom
          || (y === p.y && x <= (p.x + 1) && x >= (p.x - 1)) // left & right
          || (y === p.y +1 && x <= (p.x + 1) && x >= (p.x - 1)) // top-left & top-right
          || (y === p.y -1 && x <= (p.x + 1) && x >= (p.x - 1)) // bottom-left & bottom-right
    },
    cellClass: function(cell) {
      let klass = ["cell"]
      klass.push(this.isReachable(cell) ? " reachable" : "");
      klass.push(this.Player.x === cell.x && this.Player.y === cell.y ? " player" : "");
      klass.push(cell.enemies.length ? " enemy" : "");
      klass.push(` ${cell.kind}`);
      return klass.join(' ');
    },
    moveTo: function(x, y) {
      this.$emit('movePlayer', x, y)
    }
  }
}
</script>

<style lang="scss" src="../assets/table.scss" scoped></style>

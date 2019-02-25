<template>
  <div class="MapContainer">
    <div class="MapScroll" ref="mapScroll">
      <div class="Map">
        <div class="Map__cells">
          <div
            v-for="cell in cells"
            :class="cellClass(cell)"
            :key="cell.uid"
          >
            <div v-if="isReachable(cell)" @click="selectCell(cell)">
              <span v-if="isAdmin && cell.enemies.length">{{ cell.enemies.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    currentCell: {
      type: Object,
      default: () => ({})
    },
    player: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    isCurrentCell(cell) {
      return this.currentCell.id === cell.id;
    },
    isReachable(cell) {
      if (this.isAdmin) {
        return true;
      }
      if (cell.kind === "unreachable") {
        return false;
      }
      const x = cell.x;
      const y = cell.y;
      const p = this.player;
      if (x === p.x && y === p.y) { return false }
      return (x === p.x && y <= (p.y + 1) && y >= (p.y - 1)) // top & bottom
          || (y === p.y && x <= (p.x + 1) && x >= (p.x - 1)) // left & right
          || (y === p.y +1 && x <= (p.x + 1) && x >= (p.x - 1)) // top-left & top-right
          || (y === p.y -1 && x <= (p.x + 1) && x >= (p.x - 1)) // bottom-left & bottom-right
    },
    cellClass: function(cell) {
      let klass = ["Cell"]
      klass.push(this.isReachable(cell) ? "--reachable" : "");
      klass.push(this.isCurrentCell(cell) ? "--current" : "");
      klass.push(cell.enemies.length ? "--enemy" : "");
      klass.push(`--${cell.kind}`);
      return klass.join(' Cell');
    },
    selectCell: function(cell) {
      this.$emit('selectCell', cell);
      this.alignCurrentCell();
    },
    alignCurrentCell() {
      this.$nextTick(function () {
        var cell = document.querySelector('.Cell--current');
        this.$refs.mapScroll.scrollLeft = cell.offsetLeft - (window.outerWidth / 2) + (cell.offsetWidth / 2);
        this.$refs.mapScroll.scrollTop  = cell.offsetTop - (this.$refs.mapScroll.offsetHeight / 2) + (cell.offsetWidth / 2);
        // this.$refs.mapScroll.style = "scroll-behavior: smooth;";
      })
    }
  },
  computed: {
    cells() {
      return this.$store.getters.getCells;
    },
    isAdmin() {
      return this.$route.path === "/map-editor";
    }
  },
  created() {
    this.alignCurrentCell();
  }
}
</script>

<style lang="scss" src="../assets/map.scss" scoped></style>

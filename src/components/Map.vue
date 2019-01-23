<template>
  <div class="map">
    <div class="cells" v-if="!isLoading">

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
</template>

<script>
import db from '../api'

export default {
  name: 'Map',
  data() {
    return {
      isLoading: false,
      cells: {
        type: Array,
        default: () => ([])
      }
    }
  },
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
      return this.currentCell.x === cell.x && this.currentCell.y === cell.y;
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
      let klass = ["cell"]
      klass.push(this.isReachable(cell) ? " reachable" : "");
      klass.push(this.isCurrentCell(cell) ? " current" : "");
      klass.push(cell.enemies.length ? " enemy" : "");
      klass.push(` ${cell.kind}`);
      return klass.join(' ');
    },
    selectCell: function(cell) {
      this.$emit('selectCell', cell);
    }
  },
  computed: {
    isAdmin() {
      return this.$route.path === "/map-editor";
    }
  },
  created () {
    this.isLoading = true;
    (async () => {
      // let cells = await this.$fetch.get('http://localhost:3000/cells')
      // this.cells = await cells.json();
      this.cells = []
      await db.collection("cells").get().then((querySnapshot) => {
        console.log(querySnapshot.docs)
        querySnapshot.forEach(item => {
          this.cells.push(item.data())
        });
      });
      this.isLoading = false;
    })()
  }
}
</script>

<style lang="scss" src="../assets/map.scss" scoped></style>

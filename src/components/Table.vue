<template>
  <div class="table">
    <div class="cells">

        <div
          v-for="cell in cells"
          :title="cell.x + cell.y"
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
    lifeCss: function (l) {
      return `background-image: linear-gradient(to right, tomato, tomato ${l-.01}%, white ${l}%, white )`
    },
    cellClass: function(cell) {
      let klass = ["cell"]
      klass.push(this.isReachable(cell) ? " reachable" : "");
      klass.push(this.Player.x === cell.x && this.Player.y === cell.y ? " player" : "");
      klass.push(cell.enemy && cell.enemy.life > 0 ? " enemy" : "");
      klass.push(` ${cell.kind}`);
      return klass.join(' ');
    },
    moveTo: function(x, y) {
      this.$emit('movePlayer', x, y)
    }
  }
}
</script>

<style scoped>
  .table {
    position: relative;
    background: url(../assets/images/map.png);
    background-size: cover;
    grid-area: table;
  }
  .cells {
    display: grid;
    height: 100%;
    padding: 4vh 8vh 7.3vh 8.8vh;
    grid-template-columns: repeat(32, 1fr);
    grid-template-rows: repeat(21, 1fr);
    width: 80vh;
    height: 53vh;
    opacity: 0.5;
    transition: all 0.3s ease-in-out;
  }
  .cell {
    cursor: auto;
    position: relative;
    display: grid;
    transition: all 0.16s ease-in-out;
  }

  .player:before {
    content:'';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    pointer-events: none;
    background: url('../assets/images/cursor.png') no-repeat top / contain;
    mix-blend-mode: darken;
  }
  .reachable:before {
    content:'';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    pointer-events: none;
    background: url('../assets/images/cursor.png') no-repeat top / contain;
    mix-blend-mode: darken;
  }

  .reachable {
    cursor: pointer;
    transform: scale(0.75);
  }
  .reachable:hover {
    z-index: 1;
    transform: scale(0.9);
  }
  .toggleIso {
    position: absolute;
    top: 0;
    right: 0;
  }
  /*debug*/
  .unreachable {
    border: 1px solid red;
  }

  .forest {
    background-color: rgba(0, 255, 0, 0.2);
  }
  .city {
    background-color: rgba(0, 255, 255, 0.2);
  }
  .mountain {
    border: 1px solid blue;
  }
  .hills {
    background-color: rgba(155, 155, 0, 0.2);
  }
</style>

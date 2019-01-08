<template>
  <div class="game">
    <div class="cells" :class="isometric ? 'iso' : ''">

        <div
          v-for="cell in cells"
          :title="cell.x + cell.y"
          :class="cellClass(cell)"
          :key="cell.uid"
        >
          <div v-if="isReachable(cell.x, cell.y)" @click="moveTo(cell.x, cell.y)"></div>
        </div>

    </div>
    <button class="toggleIso" @click="isometric = !isometric">3D</button>
  </div>
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      isometric: false
    }
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
    isReachable(x, y) {
      let p = this.Player;
      if (x === p.x && y === p.y) { return false }
      return (x === p.x && y <= (p.y + 1) && y >= (p.y - 1)) // top & bottom
          || (y === p.y && x <= (p.x + 1) && x >= (p.x - 1)) // left & right
          || (y === p.y +1 && x <= (p.x + 1) && x >= (p.x - 1)) // top-left & top-right
          || (y === p.y -1 && x <= (p.x + 1) && x >= (p.x - 1)) // bottom-left & bottom-right
    },
    lifeCss: function (l) {
      return `background-image: linear-gradient(to right, tomato, tomato ${l-.01}%, white ${l}%, white )`
    },
    cellClass: function(c) {
      let klass = this.isReachable(c.x, c.y) ? " reachable" : "";
      klass += this.Player.x === c.x && this.Player.y === c.y ? " player" : "";
      klass += c.enemy && c.enemy.life > 0 ? " enemy" : "";
      klass += ` ${c.kind}`;
      return ` ${klass} cell`;
    },
    moveTo: function(x, y) {
      this.$emit('movePlayer', x, y)
    }
  }
}
</script>

<style scoped>
  .game {
    position: relative;
    background: url(../assets/images/map.png);
    background-size: cover;
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
  .cells.iso {
    transform: perspective(3000px) scale(0.5) rotateX(45deg) rotateZ(45deg) translate3d(50%, 50%, 520px);
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
</style>

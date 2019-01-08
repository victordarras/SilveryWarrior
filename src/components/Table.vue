<template>
  <div class="game">
    <button @click="isometric = !isometric">3D</button>
    <div class="cells" :class="isometric ? 'iso' : ''">

        <div
          v-for="cell in cells"
          :class="cellClass(cell)"
          :key="cell.uid"
        >
          <div v-if="isReachable(cell.x, cell.y)" @click="moveTo(cell.x, cell.y)"></div>
        </div>

    </div>
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
    background: rgba(0,0,0,0.2)
  }
  .cells {
    display: grid;
    grid-template-rows: repeat(10, 2rem);
    grid-template-columns: repeat(10, 2rem);
    grid-gap: 0.2rem;
    transition: all 0.3s ease-in-out;
    transform: perspective(0) rotateX(0deg) rotateZ(0deg) translate(27%, 40%) scale(1.3);
  }
  .cells.iso {
    transform: perspective(2000px) rotateX(45deg) rotateZ(45deg) translate(50%, 51%);
  }
  .cell {
    cursor: auto;
    position: relative;
    display: grid;
    background-color: currentColor;
    opacity: 0.8;
    border-radius: 3px;
    box-shadow: 2px 2px 0 rgba(0,0,0,0.5), 2px 2px 0 currentColor;
    transition: all 0.16s ease-in-out;
  }
  .cell:hover {
    opacity: 1;
  }
  .cell:before {
    position: absolute;
    font-size: 1.8em;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .cell.forest {color: darkgreen}
  .cell.forest:before {content: "🌳";}
  .cell.hill {color: forestgreen}
  .cell.hill:before {content: "🏔";}
  .cell.plain {color: gold}
  .cell.plain:nth-child(3n + 1) {
    color: goldenrod
  }
  .cell.city {color: saddlebrown}
  .cell.city:before {content: "🏛";}

  .player, .reachable {
    opacity: 1;
    border: 2px solid #fff;
  }
  .cell.player:before {
    content: '⚔';
  }
  .reachable {
    cursor: pointer;
  }
  .reachable:hover {
    z-index: 1;
    border: 5px solid #fff;
  }
</style>

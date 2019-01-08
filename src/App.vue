<template>
  <div id="app">
    <template v-if="isLoading">
      Chargement…
    </template>

    <template v-else>

      <section class="Player">
        <h3>{{ currentPlayer.name }}</h3>
        <div class="lifeBar" :style="lifeCss(currentPlayer.life)">
          <strong>{{ currentPlayer.life }}</strong> /100
        </div>
        <hr>
        <br><strong>{{ currentPlayer.atk }}</strong> - <em>Attack</em>
        <br><strong>{{ currentPlayer.def }}</strong> - <em>Defense</em>
        <br><strong>{{ currentPlayer.spe }}</strong> - <em>Special</em>
      </section>
      <Table
        :cells="cells"
        :Player="currentPlayer"
        @movePlayer="movePlayer"
      />

      <section class="logs">
        <ul>
          <li v-for="(log, i) in logs" :key="i"><code>{{ log }}</code></li>
        </ul>
      </section>
      <div class="buttons">
        <button @click="spawnMob">Create mob</button>
        <button @click="drinkPopo(50)">Drink Potion (+50)</button>
        <button @click="generateNewWorld()">Generate new World</button>
      </div>
      <Place
        :cell="currentCell"
        @attack="fight"
      />

    </template>

  </div>
</template>

<script>
import Table from './components/Table.vue'
import Place from './components/Place.vue'
function roll (sides) {
  return Math.floor(Math.random() * sides) + 1;
}
function biome() {
  switch (roll(30)) {
    case 1:
      return "city";
    case 2:
    case 3:
    case 4:
      return "hill"
    case 5:
    case 6:
    case 7:
    case 8:
      return "forest"
    default:
      return "plain";
  }
}
function newUID() {
  return ('' + Math.random()).substr(2, 9)
}
function newPlayer() {
  return {
    name: "Œ",
    life: 100,
    atk: 14,
    def: 4,
    spe: 2,
    x: 0,
    y: 0
  }
}
function newEnemy() {
  return {
    name: "orc",
    id: newUID(),
    life: 100,
    atk: 4,
    def: 4,
    spe: 1
  }
}
function newCell(x, y) {
  return {
    id: newUID(),
    kind: biome(),
    x: x,
    y: y,
    enemies: [newEnemy()],
    players: []
  }
}
export default {
  name: 'app',
  data: () => {
    return {
      isLoading: false,
      size: 3,
      currentPlayer: {},
      logs: [],
      cells: [[]],
      players: []
    }
  },
  methods: {
    lifeCss: function (l) {
      return `background-image: linear-gradient(to right, darkred, darkred ${l-.01}%, grey ${l}%, grey )`
    },
    drinkPopo(health) {
      this.currentPlayer.life = Math.min(this.currentPlayer.life + health, 100);
    },
    spawnMob() {
      this.currentCell.enemies.push(newEnemy())
    },
    movePlayer(x, y) {
      this.currentPlayer.x = x;
      this.currentPlayer.y = y;
      this.logs.unshift(`Vous vous déplacez en [${x}-${y}] (${this.currentCell.kind})`);
      this.currentCell.enemies.forEach(this.attackPlayerBy)
    },
    attackPlayerBy(enemy) {
      const damage = (enemy.atk + roll(6) - this.currentPlayer.def + roll(6));
      this.currentPlayer.life -= damage
      this.logs.unshift(`⚔ Vous êtes attaqué par ${enemy.name} et recevez ${damage} dégats !`);
    },
    fight(enemy, player = this.currentPlayer) {
      const pDamage = (player.atk + roll(6) - enemy.def + roll(6));
      const eDamage = (enemy.atk + roll(6) - player.def + roll(6));
      enemy.life -= pDamage;
      player.life -= eDamage;

      if (enemy.life > 0) {
        this.logs.unshift(`⚔ Vous attaquez ${enemy.name} et lui infligez ${pDamage} dégats !\n${enemy.name} vous inflige, ${eDamage} dégats !`);
        // this.$fetch.patch(`http://localhost:3000/cells/${this.currentCell.id}/enemies/${enemy.id}`, enemy)
      } else {
        this.currentCell.enemies.splice(this.currentCell.enemies.indexOf(enemy), 1)
        this.logs.unshift(`💀 Vous achevez cet ${enemy.name} en lui infligeant ${pDamage} dégats !`);
        // this.$fetch.patch('http://localhost:3000/currentPlayer', player)
      }

      // if (this.currentCell.enemies.length === 0) {
      //   this.currentCell.enemies.push(newEnemy());
      // }
    },
    cellPlayers(x, y) {
      return this.players.find(p => p.x == x && p.y == y );
    },
    cellEnemies() {
      return this.currentCell.enemies;
    },
    generateNewWorld() {
      let cells = []
      for (var x = 0; x < 10; x++) {
        // let row = []
        for (var y = 0; y < 10; y++) {
          cells.push(newCell(x, y))
        }
      }
      this.cells = cells;
    }
  },
  computed: {
    currentCell() {
      return this.cells.find(c => c.x === this.currentPlayer.x && c.y === this.currentPlayer.y);
    }
  },
  async created () {
    this.isLoading = true;

    this.currentPlayer = newPlayer();
    // this.currentPlayer.name = prompt('Veuillez choisir un nom avant de commencer la partie…');
    (async () => {
      let currentPlayer = await this.$fetch.get('http://localhost:3000/currentPlayer')
      this.currentPlayer = await currentPlayer.json();

      let cells = await this.$fetch.get('http://localhost:3000/cells')
      this.cells = await cells.json();
      this.isLoading = false;
    })()
    return this.logs.unshift("Vôtre voyage commence ici.")
  },
  updated() {
    this.$fetch.patch('http://localhost:3000/currentPlayer', this.currentPlayer)
  },
  components: {
    Table, Place
  }
}
</script>

<style>
body {
  margin: 0;
  box-sizing: border-box;
  background: radial-gradient(#000, #555);
  color: #eee;
}
ul {
  list-style: none
}

*,*:after,*:before{box-sizing: inherit;}
#app {
  font-family: 'Lora',serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  max-height: 99vh;
  max-width: 100vw;
  display: grid;
  grid-template-columns: 15% 60% 25%;
  grid-template-rows: 80vh 1fr;
  padding: 10px;
  grid-gap: 10px;
}

.lifeBar {
  margin: 10px 0;
  border-radius: 5px;
  color: #fff;
  text-align: center;
}

.logs li:first-child {  opacity: 1}
.logs li:nth-child(2) { opacity: 0.7}
.logs li:nth-child(3) { opacity: 0.6}
.logs li {  opacity: 0.5}
</style>

<template>
  <div id="app">
    <template v-if="isLoading">
      Chargement…
    </template>

    <template v-else>

      <Profile :player="currentPlayer" />
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
      <Place
        :cell="currentCell"
        @attack="fight"
      />
    <div class="buttons">
      <button @click="spawnMob()">Create mob</button>
      <button @click="generateNewWorld()">Generate new World</button>
      <button @click="changeName()">Change player name</button>
      <button @click="savePlayerData()">Save player</button>
      <button @click="drinkPopo(50)">Drink popo</button>
    </div>

    </template>

  </div>
</template>

<script>
import Profile from './components/Profile.vue'
import Table from './components/Table.vue'
import Place from './components/Place.vue'


const WORLD_SIZE = {x: 32, y: 21}

function roll (sides) {
  return Math.floor(Math.random() * sides) + 1;
}
function newBiome() {
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
  const
    biome = newBiome(),
    enemies = [];

  if (biome !== "city") {
    enemies.push(newEnemy())
  }
  if (biome === "forest") {
    enemies.push(newEnemy())
  }

  return {
    id: newUID(),
    kind: biome,
    x: x,
    y: y,
    enemies: enemies,
    players: []
  }
}

function newWorld() {
  let cells = []
    for (var y = 0; y < WORLD_SIZE.y; y++) {
  for (var x = 0; x < WORLD_SIZE.x; x++) {
      cells.push(newCell(x, y))
    }
  }
  return cells
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
    log(message, kind) {
      this.logs.unshift(message);
    },
    savePlayerData() {
      this.$fetch.patch('http://localhost:3000/currentPlayer', this.currentPlayer)
    },
    changeName() {
      this.currentPlayer.name = prompt('Veuillez choisir nouveau pseudo :');
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
      this.log(`Vous vous déplacez en [${x}-${y}] (${this.currentCell.kind})`);
      this.currentCell.enemies.forEach(this.attackPlayerBy)
    },
    attackPlayerBy(enemy) {
      const damage = (enemy.atk + roll(6) - this.currentPlayer.def + roll(6));
      this.currentPlayer.life -= damage
      this.log(`⚔ Vous êtes attaqué par ${enemy.name} et recevez ${damage} dégats !`);
    },
    fight(enemy, player = this.currentPlayer) {
      const pDamage = (player.atk + roll(6) - enemy.def + roll(6));
      const eDamage = (enemy.atk + roll(6) - player.def + roll(6));
      enemy.life -= pDamage;
      player.life -= eDamage;

      if (enemy.life > 0) {
        this.log(`⚔ Vous attaquez ${enemy.name} et lui infligez ${pDamage} dégats !\n${enemy.name} vous inflige, ${eDamage} dégats !`);
        // this.$fetch.patch(`http://localhost:3000/cells/${this.currentCell.id}/enemies/${enemy.id}`, enemy)
      } else {
        this.currentCell.enemies.splice(this.currentCell.enemies.indexOf(enemy), 1)
        this.log(`💀 Vous achevez cet ${enemy.name} en lui infligeant ${pDamage} dégats !`);
        // this.$fetch.patch('http://localhost:3000/currentPlayer', player)
      }

      if (this.currentCell.enemies.length === 0) {
        this.currentCell.enemies.push(newEnemy());
      }
    },
    cellPlayers(x, y) {
      return this.players.find(p => p.x == x && p.y == y );
    },
    cellEnemies() {
      return this.currentCell.enemies;
    },
    generateNewWorld() {
      this.cells = newWorld();
    }
  },
  computed: {
    currentCell() {
      return this.cells.find(c => c.x === this.currentPlayer.x && c.y === this.currentPlayer.y);
    }
  },
  async created () {
    this.isLoading = true;

    (async () => {
      let currentPlayer = await this.$fetch.get('http://localhost:3000/currentPlayer')
      this.currentPlayer = await currentPlayer.json();

      let cells = await this.$fetch.get('http://localhost:3000/cells')
      this.cells = await cells.json();
      this.isLoading = false;
    })()
    this.currentPlayer = this.currentPlayer ? this.currentPlayer : newPlayer();
    return this.log("Votre voyage commence ici.")
  },
  updated() {
  },
  components: {
    Table, Place, Profile
  }
}
</script>

<style>
#app {
  font-family: 'Lora',serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 99vh;
  max-width: 100vw;
  display: grid;
  grid-template-columns: 220px 80vh 1fr;
  grid-template-rows: 53vh 1fr;
  padding: 10px;
  grid-gap: 10px;
}

.buttons button {
  display: inline-block;
  vertical-align: top;
  -webkit-appearance: none;
  border: 2px solid #222;
  margin: 5px;
  transform: skew(5deg);
}
.buttons button:hover {
  border-bottom-width: 3px;
  border-top-width: 1px;
  transform: skew(3deg);
}
.buttons button:active {
  border-top-width: 3px;
  border-bottom-width: 1px;
}

.logs li:first-child {  opacity: 1}
.logs li:nth-child(2) { opacity: 0.7}
.logs li:nth-child(3) { opacity: 0.6}
.logs li {  opacity: 0.5}
</style>

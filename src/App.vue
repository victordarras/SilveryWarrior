<template>
  <div id="app">
    <template v-if="isLoading">
      Chargement…
    </template>

    <template v-else>

      <Profile :player="currentPlayer" />
      <Table
        :cell="currentCell"
        :cells="cells"
        :Player="currentPlayer"
        @movePlayer="movePlayer"
      />
      <!-- Development helpers -->
      <div class="buttons">
        <button @click="setCellKind()">Set Cell KIND</button>
        <button @click="createMob(0)">createMob(0)</button>
        <button @click="createMob(1)">createMob(1)</button>
        <button @click="createMob(2)">createMob(2)</button>
        <button @click="clearCell">CLEAR</button>
        <hr>
        <button @click="changeName()">Change player name</button>
        <button @click="savePlayerData()">Save player</button>
        <button @click="drinkPopo(50)">Drink popo</button>
        <p v-for="key in Object.keys(currentCell)" :key="key">{{key}}: {{currentCell[key]}}</p>
      </div>
      <Place
        :cell="currentCell"
        @attack="fight"
      />
      <Logger :logs="logs" />


    </template>

  </div>
</template>

<script>
import Profile from './components/Profile.vue'
import Table from './components/Table.vue'
import Place from './components/Place.vue'
import Logger from './components/Logger.vue'

const CELL_KINDS = [
  'unreachable',
  'forest',
  'city',
  'mountain',
  'hills',
  'plain',
]
const MOBS = [
  {
    "id": 0,
    "name": "Légume furieux",
    "life": 20,
    "atk": 2,
    "def": 2,
    "spe": 2
  },{
    "id": 1,
    "name": "Etagère en colère",
    "life": 35,
    "atk": 2,
    "def": 5,
    "spe": 0
  },{
    "id": 2,
    "name": "Abatjour vénèr'",
    "life": 50,
    "atk": 4,
    "def": 5,
    "spe": 10
  },
];


function roll (sides) {
  return Math.floor(Math.random() * sides) + 1;
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
function newEnemy(id) {
  const mob = MOBS[id];
  return {
    ...mob,
    id: newUID(),
    currentLife: mob.life,
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
    // MAP EDITOR
    createMob(id) {
      this.currentCell.enemies.push(newEnemy(id));
      this.$fetch.patch(`http://localhost:3000/cells/${this.currentCell.id}`, this.currentCell)
    },
    clearCell() {
      this.currentCell.enemies = [];
      this.$fetch.patch(`http://localhost:3000/cells/${this.currentCell.id}`, this.currentCell)
    },
    setCellKind() {
      const kind = prompt(CELL_KINDS)
      this.currentCell.kind = kind;
      this.$fetch.patch(`http://localhost:3000/cells/${this.currentCell.id}`, this.currentCell)
    },
    // ADMIN
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
    // NON ADMIN
    log(message/*, kind*/) {
      this.logs.unshift(message);
    },
    movePlayer(x, y) {
      this.currentPlayer.x = x;
      this.currentPlayer.y = y;
      this.log(`Vous vous déplacez en [${x}-${y}] (${this.currentCell.kind})`);
      this.currentCell.enemies.forEach(this.attackPlayerBy)
    },
    attackPlayerBy(enemy) {
      const damage = (enemy.atk + roll(6) - this.currentPlayer.def + roll(6));
      this.currentPlayer.currentLife -= damage
      this.log(`⚔ Vous êtes attaqué par ${enemy.name} et recevez ${damage} dégats !`);
    },
    fight(enemy, player = this.currentPlayer) {
      const pDamage = (player.atk + roll(6) - enemy.def + roll(6));
      const eDamage = (enemy.atk + roll(6) - player.def + roll(6));
      enemy.currentLife -= pDamage;
      player.currentLife -= eDamage;

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
    Table, Place, Profile, Logger
  }
}
</script>

<style>
#app {
  font-family: 'Lora',serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: grid;
  /*padding: 10px;*/
  grid-gap: 10px;
  grid-template-columns: 300px 80vh 1fr;
  grid-template-rows: 53vh 1fr 1fr;
  grid-template-areas:
    "profile table buttons"
    "profile place logs"
    "profile place logs";
}

.buttons {
  grid-template-area: buttons;
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
</style>

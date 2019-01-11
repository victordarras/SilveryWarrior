<template>
  <div id="app">
    <template v-if="isLoading">
      <h1>L</h1>
      <h1>O</h1>
      <h1>A</h1>
      <h1>D</h1>
    </template>
    <template v-else-if="currentPlayer.currentLife > 0">
      <!-- Development helpers -->
      <div class="buttons">
        <button @click="isAdmin = !isAdmin">Toggle Admin</button>
        <template v-if="isAdmin">
          <h5>Admin</h5>
          <h6>Player</h6>
          <button @click="changeName()">Change player name</button>
          <button @click="savePlayerData()">Save player</button>
          <button @click="drinkPopo(50)">Drink popo</button>
        </template>
      </div>

      <Profile
        :player="currentPlayer"
        @drinkPotion="addLife"
      />
      <Map
        :currentCell="currentCell"
        :cells="cells"
        :Player="currentPlayer"
        @selectCell="movePlayer"
      />

      <Place :cell="currentCell" @attack="fight" />

      <Logger :logs="logs" />

    </template>
    <template v-else>
      <h1>YOU DEAD</h1>
      <button @click="revive()">Drink popo</button>
    </template>

  </div>
</template>

<script>
import Profile from './Profile.vue'
import Map from './Map.vue'
import Place from './Place.vue'
import Logger from './Logger.vue'

const MOBS = [
  {
    "id": 0,
    "name": "Canard boiteux",
    "picture": "🦆",
    "life": 20,
    "atk": 2,
    "def": 2,
    "spe": 2,
    "exp": 10
  },{
    "id": 1,
    "name": "Poussin malin",
    "picture": "🐣",
    "life": 35,
    "atk": 2,
    "def": 5,
    "spe": 0,
    "exp": 10
  },{
    "id": 2,
    "name": "Poulpe fou",
    "picture": "🦑",
    "life": 50,
    "atk": 4,
    "def": 5,
    "spe": 10,
    "exp": 10
  },
];


function roll (sides) {
  return Math.floor(Math.random() * sides) + 1;
}
function newUID() {
  return ('' + Math.random()).substr(2, 9)
}
// function newPlayer() {
//   return {
//     name: "Œ",
//     level: 1,
//     life: 100,
//     currentLife: 100,
//     atk: 14,
//     def: 4,
//     spe: 2,
//     x: 0,
//     y: 0,
//     exp: 0,
//     death: 0,
//     kills: 0
//   }
// }
function newEnemy(id = 0) {
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
      isAdmin: false,
      isLoading: false,
      currentPlayer: {},
      logs: [],
      cells: [],
      players: []
    }
  },
  methods: {
    updateCell(cell = this.currentCell) {
      this.$fetch.patch(`http://localhost:3000/cells/${cell.id}`, cell)
        .then("DONE updateCell");
    },
    // ADMIN
    savePlayerData() {
      this.$fetch.patch('http://localhost:3000/currentPlayer', this.currentPlayer)
        .then("DONE savePlayerData");
    },
    changeName() {
      this.currentPlayer.name = prompt('Veuillez choisir nouveau pseudo :');
    },
    addLife(health = 50) {
      if (this.currentPlayer.currentLife < this.currentPlayer.life) {
        this.currentPlayer.currentLife = Math.min(this.currentPlayer.currentLife + health, 100);
      }
    },
    spawnMob() {
      this.currentCell.enemies.push(newEnemy())
    },
    // NON ADMIN
    log(message, kind = "normal") {
      this.logs.push({kind: kind,content: message, id: this.logs.length});
    },
    revive() {
      this.currentPlayer.exp = Math.round(this.currentPlayer.exp *= 0.875);
      this.currentPlayer.death += 1;
      this.currentPlayer.currentLife = this.currentPlayer.life;
      this.savePlayerData();
    },
    movePlayer(cell) {
      this.currentPlayer.x = cell.x;
      this.currentPlayer.y = cell.y;
      this.currentCell.enemies.forEach(this.attackPlayerBy);
      this.savePlayerData();
      this.log(`Vous vous déplacez en [${cell.x}-${cell.y}] (${this.currentCell.kind})`);
    },
    attackPlayerBy(enemy) {
      const damage = (enemy.atk + roll(6) - this.currentPlayer.def + roll(6));
      this.currentPlayer.currentLife -= damage
      this.log(`⚔ Vous êtes attaqué par ${enemy.name} et recevez ${damage} dégats !`, 'warning');
    },
    fight(enemy, player = this.currentPlayer) {
      const pDamage = (player.atk + roll(6) - enemy.def + roll(6));
      const eDamage = (enemy.atk + roll(6) - player.def + roll(6));

      if (player.spe >= enemy.spe) {
        enemy.currentLife -= pDamage;
        player.currentLife -= eDamage;
        this.log(`⚔ Vous attaquez ${enemy.name} et lui infligez ${pDamage} dégats !`);
        this.log(`⚔ ${enemy.name} vous inflige, ${eDamage} dégats !`, 'warning');
      } else  {
        player.currentLife -= eDamage;
        enemy.currentLife -= pDamage;
        this.log(`⚔ ${enemy.name} vous inflige ${eDamage} dégats !`, 'warning');
        this.log(`⚔ Vous attaquez ${enemy.name} et lui infligez ${pDamage} dégats !`);
      }

      if (player.currentLife <= 0) {
        this.log(`☠ Vous avez été brutalement abbatu par ${enemy.name} en lui infligeant ${pDamage} dégats !`, 'alert');
      }
      if (enemy.currentLife <= 0) {
        this.currentPlayer.exp += enemy.exp;
        this.currentPlayer.kills += 1;
        this.log(`💀 Vous achevez ${enemy.name} en lui infligeant ${pDamage} dégats !`, 'success');
        this.currentCell.enemies.splice(this.currentCell.enemies.indexOf(enemy), 1);
        //
      }
      // if (this.currentCell.enemies.length === 0) {
      //   this.currentCell.enemies.push(newEnemy());
      // }

      this.savePlayerData()
      // TODO : update enemies, not the Cell
      this.updateCell()
      // this.$fetch.patch(`http://localhost:3000/cells/${this.currentCell.id}/enemies/${enemy.id}`, enemy)
    },
    cellPlayers(x, y) {
      return this.players.find(p => p.x == x && p.y == y );
    }
  },
  computed: {
    currentCell() {
      return this.cells.find(c => c.x === this.currentPlayer.x && c.y === this.currentPlayer.y);
    }
  },
  created () {
    this.isLoading = true;

    (async () => {
      let currentPlayer = await this.$fetch.get('http://localhost:3000/currentPlayer')
      this.currentPlayer = await currentPlayer.json();

      let cells = await this.$fetch.get('http://localhost:3000/cells')
      this.cells = await cells.json();
      this.isLoading = false;
    })()

    return this.log("🎲 Votre voyage commence ici.")
  },
  components: {
    Map, Place, Profile, Logger
  }
}
</script>

<style lang="scss" src="../assets/game.scss" scoped></style>

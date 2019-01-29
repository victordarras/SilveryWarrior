<template>
  <section id="app">
    <Sidebar
      :player="currentPlayer"
      @useItem="useItem"
      @logout="logout"
    />
    <template v-if="currentPlayer.currentLife > 0">
      <Map
        :currentCell="currentCell"
        :cells="cells"
        :player="currentPlayer"
        @selectCell="movePlayer"
      />

      <Place
        :cell="currentCell"
        @attack="fight"
        @sleep="addLife(currentPlayer.life)"
        @buyItem="addItem"
      />
    </template>

    <section v-else>
      <h1>YOU ARE DEAD</h1>
      <button @click="revive()">Revive (XP x 0.875)</button>
    </section>

    <Logger :logs="logs" />
  </section>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Map from './Map.vue'
import Place from './Place.vue'
import Logger from './Logger.vue'
import { roll } from '../helpers.js'

export default {
  name: 'Game',
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
    logout() {
      sessionStorage.setItem("currentPlayerUid", undefined);
      window.location = "/"
    },
    log(message, kind = "normal") {
      this.logs.push({kind: kind,content: message, id: this.logs.length});
    },
    updateCell(cell = this.currentCell) {
      this.$fetch.patch(`http://localhost:3000/cells/${cell.id}`, cell);
    },
    savePlayerData() {
      this.$fetch.patch('http://localhost:3000/players/' + currentPlayer.uid, this.currentPlayer);
    },
    addLife(health = 50) {
      if (this.currentPlayer.currentLife < this.currentPlayer.life) {
        this.currentPlayer.currentLife = Math.min(this.currentPlayer.currentLife + health, 100);
      }
    },
    useItem(item, Player = this.currentPlayer) {
      // Items API need Player Object
      item.effects.forEach(effect => eval(effect));
      Player.currentLife = Math.min(Player.currentLife, Player.life);
      Player.items.splice(Player.items.indexOf(item), 1);
      this.log(`Vous utilisez ${item.picture}${item.name} (${item.effects})`, "success")
      this.savePlayerData();
    },
    addItem(item) {
      if (this.currentPlayer.money - item.price <= 0) { // can't buy item
        return this.log("Vous n'avez pas assez d'argent", "alert")
      }

      this.currentPlayer.money -= item.price;
      this.currentPlayer.items.push(item);
      this.log(`Vous achetez ${item.name} pour ${item.price}💰`, "success");
      this.savePlayerData();
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
      this.log(`Vous vous déplacez en [ ${cell.x}, ${cell.y} ] (${this.currentCell.kind})`);
      this.currentCell.enemies.forEach(this.attackPlayerBy);
      this.savePlayerData();
    },
    attackPlayerBy(enemy) {
      const damage = (enemy.atk + roll(6) - this.currentPlayer.def + roll(6));
      this.currentPlayer.currentLife -= damage
      this.log(`Vous êtes attaqué par ${enemy.name} et recevez ${damage} dégats !`, 'warning');
    },
    fight(enemy, player = this.currentPlayer) {
      const pDamage = (player.atk + roll(6) - enemy.def  + roll(6));
      const eDamage = (enemy.atk  + roll(6) - player.def + roll(6));

      if (player.spe >= enemy.spe) {
        enemy.currentLife -= pDamage;
        player.currentLife -= eDamage;
        this.log(`Vous attaquez ${enemy.name} et lui infligez ${pDamage} dégats !`);
        this.log(`${enemy.name} vous inflige ${eDamage} dégats !`, 'warning');
      } else  {
        player.currentLife -= eDamage;
        enemy.currentLife -= pDamage;
        this.log(`${enemy.name} vous inflige ${eDamage} dégats !`, 'warning');
        this.log(`Vous attaquez ${enemy.name} et lui infligez ${pDamage} dégats !`);
      }

      if (player.currentLife <= 0) {
        this.log(`Vous avez été brutalement abbatu par ${enemy.name}`, 'alert');
      }
      if (enemy.currentLife <= 0) {
        player.exp += enemy.exp;
        player.money += enemy.money;
        player.kills += 1;
        this.log(`Vous achevez ${enemy.name} en lui infligeant ${pDamage} dégats ! (+${enemy.exp}xp, +${enemy.money}💰)`, 'success');
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
  mounted () {
    this.isLoading = true;

    var currentPlayerUid;
    while (currentPlayerUid === undefined || currentPlayerUid === null) {
      currentPlayerUid = sessionStorage.getItem('currentPlayerUid') ||  prompt("Quel est vôtre UID ?", "Sp1r1tu3l");
    }

    (async () => {
      let currentPlayer = await this.$fetch.get(`http://localhost:3000/players/${currentPlayerUid}`)
      this.currentPlayer = await currentPlayer.json();
      let cells = await this.$fetch.get('http://localhost:3000/cells')
      this.cells = await cells.json();

      this.isLoading = false;
    })()

    return this.log("Bonjour, votre aventure commence ici.");
  },
  components: {
    Map, Place, Sidebar, Logger
  }
}
</script>

<style lang="scss" src="../assets/game.scss" scoped></style>

<template>
  <section id="app" class="Game">
    <template v-if="isLoading">
      <div class="Loader"></div>
    </template>
    <form class="Login" @submit.prevent="login()" v-else-if="!isConnected">
      <label for="uid">Mot de passe:</label>
      <input type="text" id="uid" v-model="currentPlayerUid">
      <button type="submit" class="button">Connexion</button>
    </form>
    <template v-else-if="!isLoading">
      <Sidebar
        @showProfile="showProfile = !showProfile"
        @clickItem="useItem"
        @logout="logout"
      />

      <Profile
        v-if="showProfile"
        @equipItem="equipItem"
        @unequipItem="unequipItem"
        @useItem="useItem"
        @clickItem="useItem"
      />

      <template v-else-if="player.currentLife > 0">
        <Map
          :currentCell="currentCell"
          :cells="cells"
          :player="player"
          @selectCell="movePlayer"
        />

        <Place
          :cell="currentCell"
          @attack="fight"
          @sleep="addLife(player.life)"
          @clickItem="buyItem"
        />
      </template>

      <section v-else>
        <h1>YOU ARE DEAD</h1>
        <button @click="revive()">Revive (XP x 0.875)</button>
      </section>

      <Logger />
    </template>
  </section>
</template>

<script>
import Sidebar from './Sidebar'
import Map from './Map'
import Place from './Place'
import Profile from './Profile'
import Logger from './Logger'
import { roll, newUID } from '../helpers'

export default {
  name: 'Game',
  data: () => {
    return {
      isConnected: false,
      isLoading: true,
      showProfile: false,
      players: [],
      currentPlayerUid: ""
    }
  },
  methods: {
    login() {
      if (this.currentPlayerUid === '') {
        return;
      }
      localStorage.setItem("currentPlayerUid", this.currentPlayerUid);

      (async () => {
        let player = await this.$fetch.get(`http://localhost:3000/players/${this.currentPlayerUid}`)
        this.$store.dispatch('updatePlayer', await player.json());
      })()

      this.isConnected = true;
      this.isLoading = false;
      this.log("Bonjour, votre aventure commence ici.");
    },
    logout() {
      localStorage.clear();
      window.location = "/"
    },
    log(message, kind = "normal") {
      this.$store.dispatch("addLog", {
        kind: kind,
        content: message,
        id: newUID()
      });
    },
    equipItem(item) {
      item.equiped = true;
      this.savePlayerData();
    },
    unequipItem(item) {
      item.equiped = false;
      this.savePlayerData();
    },
    updateCell() {
      this.$store.dispatch('updateCell', this.currentCell);
    },
    savePlayerData() {
      this.$store.dispatch('updatePlayer', this.player);
    },
    addLife(health = 50) {
      if (this.player.currentLife < this.player.life) {
        this.player.currentLife = Math.min(this.player.currentLife + health, 100);
      }
    },
    useItem(item, Player = this.player) {
      // Items API need Player Object
      if (item.kind !== "consumable") {
        return this.log(`${item.picture}${item.name} n'est pas un consommage`, "alert")
      }

      item.effects.forEach(effect => eval(effect));
      Player.currentLife = Math.min(Player.currentLife, Player.life);
      Player.items.splice(Player.items.indexOf(item), 1);
      this.log(`Vous utilisez ${item.picture}${item.name} (${item.effects})`, "success")
      this.savePlayerData();
    },
    buyItem(item) {
      if (this.player.money - item.price <= 0) { // can't buy item
        return this.log("Vous n'avez pas assez d'argent", "alert")
      }

      this.player.money -= item.price;
      this.player.items.push(item);
      this.savePlayerData();
      this.log(`Vous achetez ${item.name} pour ${item.price}💰`, "success");
    },
    revive() {
      this.player.exp = Math.round(this.player.exp *= 0.875);
      this.player.death += 1;
      this.player.currentLife = this.player.life;
      this.savePlayerData();
      this.log("Vous perdez un peu d'XP et regagnez tous vos points de vie", "success");
    },
    movePlayer(cell) {
      this.player.x = cell.x;
      this.player.y = cell.y;

      this.currentCellMobs.forEach(this.attackPlayerBy);
      this.savePlayerData();
      this.log(`Vous vous déplacez en [ ${cell.x}, ${cell.y} ] (${this.currentCell.kind})`);
    },
    attackPlayerBy(enemy) {
      const damage = Math.max(0, (enemy.atk + roll(6) - this.player.def + roll(6)));
      this.player.currentLife -= damage;
      this.log(`Vous êtes attaqué par ${enemy.name} et recevez ${damage} dégats !`, 'warning');
    },
    fight(enemy, player = this.player) {
      const mob = this.mobs.find(mob => mob.id === enemy.uid);
      enemy = this.currentCell.enemies.find(mob => mob.id === enemy.id);

      const playerAtk = player.atk + this.equipments.reduce((acc, item) => acc += item.atk, 0)
      const playerDef = player.def + this.equipments.reduce((acc, item) => acc += item.def, 0)
      const playerSpe = player.spe + this.equipments.reduce((acc, item) => acc += item.spe, 0)

      const isCritical = roll(20) >= 18;
      const eDamage = Math.max(0, (playerDef + roll(2) - mob.atk + roll(2)));
      let pDamage = Math.max(0, (playerAtk + roll(2) - mob.def + roll(2)));
      pDamage += isCritical ? pDamage : 0;

      if (playerSpe >= mob.spe) {
        enemy.currentLife -= pDamage;
        player.currentLife -= eDamage;
        this.log(`${isCritical ? 'CRITIQUE ! ' : ''}Vous attaquez ${mob.name} et lui infligez ${pDamage} dégats !`);
        this.log(`${mob.name} vous inflige ${eDamage} dégats !`, 'warning');
      } else  {
        player.currentLife -= eDamage;
        enemy.currentLife -= pDamage;
        this.log(`${mob.name} vous inflige ${eDamage} dégats !`, 'warning');
        this.log(`Vous attaquez ${mob.name} et lui infligez ${pDamage} dégats !`);
      }

      if (player.currentLife <= 0) {
        this.log(`Vous avez été brutalement abbatu par ${mob.name}`, 'alert');
      }
      if (enemy.currentLife <= 0) {
        player.exp += mob.exp;
        player.money += mob.money;
        player.kills += 1;
        this.log(`Vous achevez ${mob.name} en lui infligeant ${pDamage} dégats ! (+${mob.exp}xp, +${mob.money}💰)`, 'success');
        this.currentCell.enemies.splice(this.currentCell.enemies.indexOf(enemy), 1);
        this.$fetch.del('http://localhost:3000/livingMobs/' + enemy.id);
      }

      this.savePlayerData();
      this.updateCell();
      this.$fetch.patch(`http://localhost:3000/livingMobs/${enemy.id}`, enemy)
    },
    cellPlayers(x, y) {
      return this.players.find(p => p.x == x && p.y == y );
    }
  },
  computed: {
    mobs() {
      return this.$store.getters.getMobs;
    },
    cells() {
      return this.$store.getters.getCells;
    },
    player() {
      return this.$store.getters.getPlayer;
    },
    currentCellMobs() {
      return this.currentCell.enemies.map(enemy => this.mobs.find(mob => mob.id === enemy.uid));
    },
    currentCell() {
      return this.cells.find(c => c.x === this.player.x && c.y === this.player.y);
    },
    equipments() {
      return this.player.items.filter(item => item.equiped === true);
    }
  },
  created () {
    if (localStorage.getItem("currentPlayerUid")) {
      this.currentPlayerUid = localStorage.getItem("currentPlayerUid");
      this.login();
    }
  },
  components: {
    Map, Place, Sidebar, Logger, Profile
  }
}
</script>

<style lang="scss" src="../assets/game.scss" scoped></style>

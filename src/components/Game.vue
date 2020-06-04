<template>
  <section id="app" class="Game">
    <form class="Login" @submit.prevent="login()" v-if="!isConnected">
      <h1 class="PageTitle">SilverWorld</h1>
      <label for="uid">Veuillez entrer votre identifiant</label>
      <input type="text" id="uid" v-model="currentPlayerUid">
      <button type="submit" class="button">Connexion</button>
    </form>

    <template v-else-if="isLoading">
      <div class="Loader"></div>
    </template>

    <template v-if="isConnected">

      <div class="Header">
        <div class="Lifebar" :class="{'Lifebar__life--wobble': wobbleLife}">
          <div class="Lifebar__bar" :style="lifeCss"></div>
          <span class="Lifebar__value"><strong>{{ player.currentLife }}</strong>/{{ player.life }}</span>
        </div>

        <router-link class="Header__logout" style="float:right" to="/menu"></router-link>
      </div>
      <Sidebar @changePage="changePage"/>

      <div class="Center">

        <section v-if="player.currentLife <= 0">
          <h1>YOU ARE DEAD</h1>
          <button @click="revive()">Revive (XP x 0.875)</button>
        </section>

        <Fight
          v-else-if="currentEnemy"
          :enemy="currentEnemy"
          @attack="fight"
          @quit="currentEnemy = null"
        />

        <template v-else>
          <Profile
            v-if="currentPage === 'profile'"
          />
          <Inventory
            v-if="currentPage === 'equipments'"
            @equipItem="equipItem"
            @unequipItem="unequipItem"
            @useItem="useItem"
            @clickItem="useItem"
          />

          <template v-else-if="player.currentLife > 0 && currentPage === 'map'">
            <Map
              :currentCell="currentCell"
              :player="player"
              @selectCell="movePlayer"
            />
            <div class="Content">
              <h1 class="PageTitle">Carte du monde</h1>
              <h2 class="PageSubTitle">{{ currentCell.kind }}</h2>
              <Place
                :cell="currentCell"
                @choose="selectEnemy"
                @sleep="addLife(player.life)"
                @clickItem="buyItem"
              />
            </div>
          </template>
        </template>
      </div>
      <nav class="MenuMobile">
        <div class="MenuMobile__link" @click="currentPage = 'map'">MAP</div>
        <div class="MenuMobile__link" @click="currentPage = 'equipments'">EQUIPMENTS</div>
        <div class="MenuMobile__link" @click="currentPage = 'profile'">PROFILE</div>
      </nav>
    </template>
  </section>
</template>

<script>
import Map from './Map'
import Place from './Place'
import Profile from './Profile'
import Inventory from './Inventory'
import Fight from './Fight'
import Sidebar from './Sidebar'
import { roll, newUID } from '../helpers'
import API from "../api"

export default {
  name: 'Game',
  data: () => {
    return {
      isConnected: false,
      isLoading: true,
      currentPage: 'map',
      currentEnemy: null,
      wobbleLife: false,
      players: [],
      currentPlayerUid: ""
    }
  },
  methods: {
    changePage(page) {
      console.log(page)
      this.currentPage = page
    },
    login() {
      if (localStorage.getItem("currentPlayerUid")) {
        this.currentPlayerUid = localStorage.getItem("currentPlayerUid");
      }
      if (this.currentPlayerUid === '') {
        return;
      }
      localStorage.setItem("currentPlayerUid", this.currentPlayerUid);

      (async () => {
        let player = await API.get(`/players/${this.currentPlayerUid}`)
        this.$store.dispatch('updatePlayer', player.data);
      })()

      this.isConnected = true;
      window.setTimeout(() => {this.isLoading = false}, 1000)
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
    drinkPotion() {
      const popo = this.player.items.find(item => item.id === "123456789");
      if (popo != undefined) {
        this.useItem(popo);
      }
    },
    useItem(item, Player = this.player) {
      // Items API need Player Object
      if (item.kind !== "consumable") {
        return this.log(`${item.picture}${item.name} n'est pas consommable`, "alert")
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
      this.$store.dispatch('revive');
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
    selectEnemy(enemy) {
      this.currentEnemy = this.currentCell.enemies.find(mob => mob.id === enemy.id);
    },
    fight(enemy = this.currentEnemy, player = this.player) {
      const mob = this.mobs.find(mob => mob.id === enemy.uid);
      // enemy = this.currentCell.enemies.find(mob => mob.id === enemy.id);

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
        this.updateCell();
        API.delete('/livingMobs/' + enemy.id);
      } else {
        API.patch(`/livingMobs/${enemy.id}`, enemy)
      }

      this.savePlayerData();
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
    },
    potionsCount() {
      return this.player.items ? this.player.items.filter(item => item.id === "123456789").length : [];
    },
    lifeCss () {
      const l = (this.player.currentLife / this.player.life) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    }
  },
  watch: {
    "player.currentLife"() {
      this.wobbleLife = true;
      window.setTimeout(() => {
        this.wobbleLife = false;
      }, 300)
    }
  },
  created () {
    this.login();
  },
  components: {
    Map, Place, Profile, Inventory, Fight, Sidebar
  }
}
</script>

<style lang="scss" src="../assets/game.scss" scoped></style>

<template>
  <section class="mapEditor">
    <h1>Map editor</h1>
    <!-- <button @click="addInfo">Add info</button> -->
    <div class="left">
      <Map
        v-if="currentCell"
        :cells="cells"
        :currentCell="currentCell"
        @selectCell="selectCell"
      />
    </div>
    <div class="right">
      <section class="Form" v-if="currentCell">
        <h2>Cell {{ currentCell.name ? currentCell.name : 'unnamed' }} [{{ currentCell.x }};{{ currentCell.y }}]</h2>
        <button @click="clearEnemies()">Effacer enemies</button>
        <fieldset>
          <p>Cell kind: {{ currentCell.kind }}</p>
          <select v-model="currentCell.kind" @change="updateCell(currentCell)">
            <option :value="kind" :key="kind" v-for="kind in cellKinds">{{ kind }}</option>
          </select>
        </fieldset>

        <fieldset>
          <select v-model="selectedMob">
            <option :value="mob" :key="mob.uid" v-for="mob in mobs">{{ mob.name }}</option>
          </select>
          <button @click="addMob()" type="submit">Add Mob</button>
          <pre><code>{{ selectedMob }}</code></pre>

          <ul v-if="enemies.length > 0" class="enemy-list">
            <li :key="enemy.id" v-for="enemy in enemies">
              <button @click="deleteEnemy(enemy)">🗑</button>{{ mobs.find(mob => mob.id === enemy.uid).name }}
            </li>
          </ul>
          <p v-else>Aucun enemi sur cette case</p>

          <!-- <Place
            :cell="currentCell"
          /> -->
        </fieldset>
      </section>
    </div>
  </section>
</template>

<script>
import Map from './Map'
import Place from './Place'
import { newUID } from '../helpers'
import API from "../api"

export default {
  name: 'MapEditor',
  data: () => {
    return {
      currentCell: {},
      selectedMob: {},
      cellKinds: [
        'unreachable',
        'forest',
        'city',
        'mountain',
        'hills',
        'plain',
      ]
    }
  },
  methods: {
    addInfo() {
      // this.cells = this.cells.map(cell => ({...cell, name: ''}));
      // console.log('done', JSON.stringify(this.cells));
    },
    clearEnemies() {
      this.currentCell.enemies = [];
      this.updateCell();
    },
    selectCell(cell) {
      this.currentCell = cell;
    },
    updateCell() {
      this.$store.dispatch('updateCell', this.currentCell);
    },
    deleteEnemy(enemy) {
      this.enemies.splice(this.enemies.indexOf(enemy), 1)

      API.delete('/livingMobs/' + enemy.id);
      this.updateCell();
    },
    addMob() {
      const newMob = {
        id: newUID(),
        cell: this.currentCell.id,
        createdAt: new Date(),
        currentLife: this.selectedMob.life,
        uid: this.selectedMob.id
      };
      this.enemies.push(newMob)

      API.post('/livingMobs', newMob);
      this.updateCell();
    }
  },
  computed: {
    enemies() {
      return this.currentCell.enemies;
    },
    mobs() {
      return this.$store.getters.getMobs;
    },
    cells() {
      return this.$store.getters.getCells;
    }
  },
  created() {
    this.currentCell = this.cells[0];
  },
  components: {
    Map, Place
  }
}
</script>

<style lang="scss" src="../assets/admin.scss" scoped></style>

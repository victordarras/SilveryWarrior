<template>
  <section class="mapEditor">
    <h1>Map editor</h1>
    <!-- <button @click="addInfo">Add info</button> -->
    <Map
      v-if="cells"
      :cells="cells"
      :currentCell="currentCell"
      @selectCell="selectCell"
    />
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
        <pre><code>{{ selectedMob }}</code></pre>
        <button @click="addMob()" type="submit">Add Mob</button>

        <div v-if="enemies.length > 0" class="enemy-list">
          <p :key="enemy.id" v-for="enemy in enemies">
            <pre>{{ enemy }} <button @click="deleteEnemy(enemy)">🗑</button></pre>
          </p>
        </div>
        <p v-else>Aucun enemi</p>

        <Place
          :cell="currentCell"
        />
      </fieldset>
    </section>
  </section>
</template>

<script>
import Map from './Map'
import Place from './Place'
import { newUID } from '../helpers'

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

      this.$fetch.del('http://localhost:3000/livingMobs/' + enemy.id);
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

      this.$fetch.post('http://localhost:3000/livingMobs', newMob);
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

<style lang="scss" scoped>
  .mapEditor {
    padding: 0 2em;
  }
  .map {
    float: left;
    margin-right: 2rem;
  }
  .Form {
    float: left;
    margin-bottom: 0.5em;
    border: 1px solid #eee;
    padding: 0.5em;
  }
</style>

<template>
  <section class="mapEditor">
    <h1>Map editor <span v-if="isLoading">LOADING...</span></h1>
    <button @click="addInfo">Add info</button>
    <Map
      :currentCell="currentCell"
      @selectCell="selectCell"
    />
    <template v-if="currentCell">
      <h2>Cell {{ currentCell.name ? currentCell.name : 'unnamed' }} [{{ currentCell.x }};{{ currentCell.y }}]</h2>
      <p>Type: {{ currentCell.kind }}</p>


      <form @submit="updateCell(currentCell)">
        <select v-model="currentCell.kind">
          <option :value="kind" :key="kind" v-for="kind in cellKinds">{{ kind }}</option>
        </select>
        <button type="submit">Change cell type</button>
      </form>

      <form @submit="addMob()">
        <select v-model="selectedMob">
          <option :value="mob" :key="mob.id" v-for="mob in mobs">{{ mob.name }}</option>
        </select>
        <button type="submit">Add Mob</button>
      </form>

      <div v-if="currentCell.enemies" class="enemy-list">
        <button @click="clearCell">CLEAR</button>
        <p :key="enemy.id" v-for="enemy in currentCell.enemies">
          <pre>{{ enemy }} <button @click="deleteMob(enemy)">🗑</button></pre>
        </p>
      </div>
      <p v-else>Aucun enemi</p>

      <!-- <pre><code>{{currentCell}}</code></pre> -->
    </template>
  </section>
</template>

<script>
import Map from './Map.vue'
import { newUID } from '../helpers.js'

export default {
  name: 'MapEditor',
  data: () => {
    return {
      cells: [],
      currentCell: {},
      selectedMob: {},
      mobs: [],
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
    selectCell(cell) {
      this.currentCell = cell;
    },
    clearCell() {
      this.currentCell.enemies = [];
      this.updateCell()
    },
    deleteMob(enemy) {
      this.currentCell.enemies.splice(this.currentCell.enemies.indexOf(enemy), 1)
      this.updateCell()
    },
    addMob() {
      this.currentCell.enemies.push({
        ...this.selectedMob,
        currentLife: this.selectedMob.life,
        originId: this.selectedMob.id,
        id: newUID()
      })
      this.updateCell()
    },
    updateCell() {
      this.$fetch.patch('http://localhost:3000/cells/' + this.currentCell.id, this.currentCell)
    }
  },
  created () {
    this.isLoading = true;

    (async () => {
      let mobs = await this.$fetch.get('http://localhost:3000/mobs')
      this.mobs = await mobs.json();

      this.currentCell = this.cells[0];
      this.isLoading = false;
    })()
  },
  components: {
    Map
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
  form {
    display: block;
    margin-bottom: 0.5em;
    border: 1px solid #eee;
    padding: 0.5em;
  }
</style>

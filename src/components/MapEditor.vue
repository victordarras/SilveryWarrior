<template>
  <section class="mapEditor">
    <h1>Map editor <span v-if="isLoading">LOADING...</span></h1>
    <Map
      :currentCell="currentCell"
      :cells="cells"
      @selectCell="selectCell"
    />
    <template v-if="currentCell">
      <h2>{{ currentCell.id }} [{{ currentCell.x }};{{ currentCell.y }}]</h2>
      <p>{{ currentCell.kind }}</p>
      <div v-if="currentCell.enemies" class="enemy-list">
        <p v-for="enemy in currentCell.enemies">
          {{ enemy.name }} <button @click="deleteMob(enemy)">🗑</button>
        </p>
        <p v-if="!currentCell.enemies.length">Aucun enemi</p>
      </div>

      <form @submit="updateCell(currentCell)">
        <div>
          <label for="">Cell type:</label>
          <select v-model="currentCell.kind">
            <option :value="kind" v-for="kind in cellKinds">{{ kind }}</option>
          </select>
        </div>
        <button type="submit">SAVE</button>
      </form>

      <form @submit="addMob()">
        <label for="">Choose mob:</label>
        <select v-model="selectedMob">
          <option :value="mob" v-for="mob in mobs">{{ mob.name }}</option>
        </select>
        <button type="submit">SAVE</button>
      </form>

      <pre><code>{{currentCell}}</code></pre>
    </template>
  </section>
</template>

<script>
import Map from './Map.vue'

function newUID() {
  return ('' + Math.random()).substr(2, 9)
}
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
    selectCell(cell) {
      this.currentCell = cell;
    },
    deleteMob(enemy) {
      this.currentCell.enemies.splice(this.currentCell.enemies.indexOf(enemy), 1)
      this.updateCell()
    },
    addMob() {
      this.currentCell.enemies.push({
        ...this.selectedMob,
        currentLife: this.selectedMob.life,
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
      let cells = await this.$fetch.get('http://localhost:3000/cells')
      this.cells = await cells.json();

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
    float: left
  }
</style>

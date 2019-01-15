<template>
  <section class="ItemEditor">
    <h1>Item Editor</h1>
    <ul class="items">
      <li
        v-for="item in items"
        :key="item.name"
        @click="currentItem = item"
        :class="item === currentItem ? 'current' : ''"
      >
        {{ item.name }}
      </li>
    </ul>
    <form @submit="updateMob()" :style="isLoading ? 'opacity:0.5;' : ''">
      <h2>{{ currentItem.name }}</h2>({{ currentItem.id }})
      <hr>
      <div v-for="key in Object.keys(currentItem)" :key="key" v-if="key !== 'id'">
        <label :for="key">{{ key }}:</label>
        <input v-if="typeof currentItem[key] === 'boolean'" type="checkbox" v-model="currentItem[key]">
        <input v-else-if="typeof currentItem[key] === 'number'" type="number" v-model.number="currentItem[key]">
        <input v-else type="text" v-model="currentItem[key]">
      </div>
    </form>
    <button class="button" @click="updateMob(currentItem)">Save item</button>
    <button @click="addStats()">Add stats</button>
  </section>
</template>

<script>

export default {
  name: 'ItemEditor',
  data: () => {
    return {
      isLoading: true,
      items: [],
      itemOptions: {},
      currentItem: {}
    }
  },
  methods: {
    addStats() {
      this.items = this.items.map(mob => {
        return {
          ...mob,
          "money": 10
        }
      })
    },
    updateMob() {
      this.isLoading = true;
      (async () => {
        await this.$fetch.patch('http://localhost:3000/items/' + this.currentItem.id, this.currentItem)
        this.isLoading = false;
      })()
    }
  },
  created () {
    this.isLoading = true;
    (async () => {
      let items = await this.$fetch.get('http://localhost:3000/items')
      this.items = await items.json();
      let itemOptions = await this.$fetch.get('http://localhost:3000/itemOptions')
      this.itemOptions = await itemOptions.json();
      this.isLoading = false;
    })()
  }
}
</script>

<style lang="scss" scoped>
  .ItemEditor {
    padding: 0 2em;
  }
  label {
    display: inline-block;
    width: 6em;
  }
  input {
    font-size: 1em;
    padding: 0.125em 0.25em;
    margin-bottom: 0.5em;
    border: 1px solid #EEE;
    border-bottom-color: #555;
    &:focus {
      border-bottom-color: tomato;
    }
  }
  .items {
    float: left;
    margin-right: 2rem;
    padding-right: 2rem;
    border-right: 1px solid #333;
    height: 90vh;
    li {
      padding: 0.125em 0.5em;
    }
    li.current {
      border-left: 5px solid #000;
    }
  }
</style>

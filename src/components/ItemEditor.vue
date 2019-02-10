<template>
  <section class="ItemEditor">
    <h1>Item Editor</h1>
    <div class="list">
      <ul v-for="kind in Object.keys(itemsByKind)" :key="kind">
        <h4>{{ kind }}</h4>
        <li
          v-for="item in itemsByKind[kind]"
          :key="item.name"
          @click="currentItem = item"
          :class="item === currentItem ? 'current' : ''"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <form @submit.prevent="updateItem()" :style="isLoading ? 'opacity:0.5;' : ''">
      <h2>{{ currentItem.name }}</h2>
      <small>{{ currentItem.id }}</small><hr>
      <div class="Form__section">
        <label for="">Name</label>
        <input type="text" v-model="currentItem.name">
      </div>
      <div class="Form__section">
        <label for="">Kind</label>
        <select name="kind" id="kind" v-model="currentItem.kind">
          <option v-for="k in itemOptions.kind" :value="k" :key="k">{{ k }}</option>
        </select>
      </div>
      <template v-if="currentItem.kind === 'equipment'" >

        <div class="Form__section">
          <label for="">Equipment kind</label>
          <select name="eKind" id="eKind" v-model="currentItem.equipmentKind">
            <option v-for="k in itemOptions.equipmentKind" :value="k" :key="k">{{ k }}</option>
          </select>
        </div>
        <div class="Form__section">
          <label for="">Attaque</label>
          <input type="number" v-model.number="currentItem.atk">
        </div>
        <div class="Form__section">
          <label for="">Defense</label>
          <input type="number" v-model.number="currentItem.def">
        </div>
        <div class="Form__section">
          <label for="">Vitesse</label>
          <input type="number" v-model.number="currentItem.spe">
        </div>
      </template>
      <div class="Form__section">
        <label for="">Picture</label>
        <input type="text" v-model="currentItem.picture">
      </div>
      <div class="Form__section">
        <label for="">Stack By</label>
        <input type="number" v-model.number="currentItem.stackBy">
      </div>
      <div class="Form__section">
        <label for="">Effects</label>
        <code><textarea v-model="currentItem.effects"></textarea></code>
      </div>
      <div>
      <button class="button" type="submit">Save item</button>
      <button @click="addStats()">Add stats</button>
      </div>
    </form>
  </section>
</template>

<script>
import { groupBy } from "../helpers"

export default {
  name: 'ItemEditor',
  data: () => {
    return {
      isLoading: true,
      items: [],
      itemOptions: [],
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
    updateItem() {
      this.isLoading = true;
      (async () => {
        await this.$fetch.patch('http://localhost:3000/items/' + this.currentItem.id, this.currentItem)
        this.isLoading = false;
      })()
    }
  },
  computed: {
    itemsByKind() {
      return groupBy(this.items, 'kind')
    }
  },
  created () {
    this.isLoading = true;
    (async () => {
      let items = await this.$fetch.get('http://localhost:3000/items')
      this.items = await items.json();
      let itemOptions = await this.$fetch.get('http://localhost:3000/itemOptions')
      this.itemOptions = await itemOptions.json();
      this.currentItem = this.items[0];

      this.isLoading = false;
    })()
  }
}
</script>

<style lang="scss" scoped>
  .Form__section {
    margin-bottom: 0.5em;
  }
  .ItemEditor {
    padding: 0 2em;
  }
  label {
    display: inline-block;
    vertical-align: top;
    width: 10em;
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
  .list {
    float: left;
    width: 220px;
    flex-flow: column;
    margin-right: 2rem;
    padding-right: 2rem;
    border-right: 1px solid #333;
    height: 90vh;
    ul {
      margin-top: 1em;
    }
    li {
      padding: 0.125em 0.5em;
    }
    li.current {
      border-left: 5px solid #000;
    }
  }
  textarea {
    padding: 0.5rem;
  }
</style>

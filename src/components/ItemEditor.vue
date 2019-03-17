<template>
  <section class="Admin">
    <h1>Item Editor</h1>
    <div class="left">
      <table v-if="items.length">
        <thead>
          <tr>
            <th v-for="key in Object.keys(items[0])">{{ key }}</th>
          </tr>
        </thead>
        <tbody v-for="kind in Object.keys(itemsByKind)" :key="kind">
          <caption><h4>{{ kind }}</h4></caption>
          <tr
            v-for="item in itemsByKind[kind]"
            @click="currentItem = item"
            :class="item === currentItem ? 'highlight' : ''"
            :key="item.id"
          >
            <td v-for="key in Object.keys(item)">
              {{item[key]}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="right">
      <form @submit.prevent="updateItem()" :style="isLoading ? 'opacity:0.5;' : ''">
        <img :src="pictureURL(currentItem.picture)" alt="nope" width="60" height="60" class="picture">
        <h2>{{ currentItem.name }}</h2>
        <small>{{ currentItem.id }}</small>
        <br>
        <br>
        <br>
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
    </div>
  </section>
</template>

<script>
import { groupBy } from "../helpers"
import API from "../api"

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
    pictureURL(img) {
      return `/images/items/${img}`
    },
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
        await API.patch('/items/' + this.currentItem.id, this.currentItem)
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
      let items = await API.get('/items')
      this.items = await items.data;
      let itemOptions = await API.get('/itemOptions')
      this.itemOptions = await itemOptions.data;
      this.currentItem = this.items[0];

      this.isLoading = false;
    })()
  }
}
</script>

<style lang="scss" src="../assets/admin.scss" scoped></style>

<template>
  <div class="city">
    <div class="buildings">
    </div>
    <button @click="sleep()">Dormir à l'auberge (Vie max. gratuit)</button>
    <button @click="storeActive = !storeActive">Entrer dans le magasin</button>
    <div class="building" v-if="storeActive">
      <h2>Magasin</h2>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
          <button @click="buyItem(item)">Acheter ({{ item.price }}💰)</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'City',
  data() {
    return {
      isLoading: false,
      storeActive: false,
      items: []
    }
  },
  props: {
    cell: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    sleep() {
      this.$emit('sleep');
    },
    buyItem(item) {
      this.$emit('buyItem', item);
    }
  },
  created() {
    this.isLoading = true;

    (async () => {
      let items = await this.$fetch.get('http://localhost:3000/items')
      this.items = await items.json();
      this.isLoading = false;
    })()
  }
}
</script>

<style lang="scss" src="../assets/city.scss" scoped></style>

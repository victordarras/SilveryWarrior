<template>
  <div class="city">
    <div class="buildings">
      <div class="building">
        <button @click="storeActive = !storeActive">Entrer dans le magasin</button>
      </div>
      <div class="building">
        <button @click="sleep()">Dormir à l'auberge (Vie max. gratuit)</button>
      </div>
    </div>

    <div class="store" v-if="storeActive">
      <h2>Magasin</h2>
      <p>Bienvenue dans mon humble magasin, que désirez vous acheter ?</p>
      <ul class="items">
        <li class="item" v-for="item in items" :key="item.id">
          <div class="picture">{{ item.picture }}</div>
          <div class="name">{{ item.name }}</div>
          <button @click="buyItem(item)">Acheter<br>({{ item.price }}💰)</button>
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

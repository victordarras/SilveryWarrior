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

      <Inventory
        :items="items"
        :canBuy="true"
        @clickItem="clickItem"
      />
    </div>
  </div>
</template>

<script>
import Inventory from "./Inventory"
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
    clickItem(item) {
      this.$emit('clickItem', item);
    }
  },
  created() {
    this.isLoading = true;

    (async () => {
      let items = await this.$fetch.get('http://localhost:3000/items')
      this.items = await items.json();
      this.isLoading = false;
    })()
  },
  components: {
    Inventory
  }
}
</script>

<style lang="scss" src="../assets/city.scss" scoped></style>

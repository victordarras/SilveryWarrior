<template>
  <div class="City">
    <div class="City__buildings">
      <div class="City__building">
        <button @click="storeActive = !storeActive">Entrer dans le magasin</button>
      </div>
      <div class="City__building">
        <button @click="sleep()">Dormir à l'auberge (Vie max. gratuit)</button>
      </div>
    </div>

    <div class="City__store" v-if="storeActive">
      <h2>Magasin</h2>
      <p>Bienvenue dans mon humble magasin, que désirez vous acheter ?</p>

      <ItemList
        :items="items"
        :canBuy="true"
        @clickItem="clickItem"
      />
    </div>
  </div>
</template>

<script>
import ItemList from "./ItemList"
import API from "../api"

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
      let items = await API.get('/items')
      this.items = await items.data;
      this.isLoading = false;
    })()
  },
  components: {
    ItemList
  }
}
</script>

<style lang="scss" src="../assets/city.scss" scoped></style>

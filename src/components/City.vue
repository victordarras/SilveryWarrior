<template>
  <div class="City">

    <div class="City__store" v-if="storeActive">
      <hr>
      <h2 class="PageSubTitle">Magasin</h2>
      <h2 class="PageSubTitle">Etale des orfèvres</h2>

      <button style="float:right" @click="storeActive = !storeActive">Sortir</button>
      <p class="Cite">
        <strong>Marchand :</strong>
        Salut voyageur, temps de merde, nan ? Qu’est que je peux faire pour toi ?
      </p>

      <hr>
      <ItemList
        :items="items"
        :canBuy="true"
        @clickItem="clickItem"
      />
    </div>

    <div class="City__buildings" v-else>
      <div class="City__building">
        <button @click="storeActive = !storeActive">Entrer dans le magasin</button>
      </div>
      <div class="City__building">
        <button @click="sleep()">Dormir à l'auberge (Vie max. gratuit)</button>
      </div>
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
<style scoped>
  hr {
    margin: 0 -2vw 1em;
  }
</style>

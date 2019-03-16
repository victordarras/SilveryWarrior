<template>
  <div class="Place">
      <City
        v-if="cell.kind === 'city'"
        :cell="cell"
        @sleep="sleep"
        @clickItem="clickItem"
      />
      <transition-group
        v-if="currentCellMobs.length > 0"
        tag="ul"
        name="listAppear"
        class="Enemy__list"
        appear
      >
        <li
          v-for="enemy in currentCellMobs"
          v-if="enemy.currentLife > 0"
          @click="$emit('choose', enemy)"
          class="Enemy"
          :key="enemy.id"
        >
          <img class="Enemy__picture" :src="`/images/mobs/${enemy.picture}`" />
          <div class="Enemy__life" :style="lifeCss(enemy)"></div>
          <div class="Enemy__label">{{ enemy.name }}</div>
        </li>
      </transition-group>

  </div>
</template>

<script>
import City from './City.vue'

export default {
  name: 'Place',
  data() {
    return {}
  },
  props: {
    cell: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    lifeCss (enemy) {
      const l = (enemy.currentLife / enemy.life) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    },
    sleep: function() {
      this.$emit('sleep')
    },
    clickItem: function(item) {
      this.$emit('clickItem',item)
    }
  },
  computed: {
    mobs() {
      return this.$store.getters.getMobs;
    },
    currentCellMobs() {
      return this.cell.enemies ? this.cell.enemies.map(enemy => {
        return {
          ...this.mobs.find(mob => mob.id === enemy.uid),
          ...enemy
        }
      }) : []
    }
  },
  components: {
    City
  }
}
</script>

<style lang="scss" src="../assets/place.scss" scoped></style>
<style lang="scss" src="../assets/enemies.scss" scoped></style>

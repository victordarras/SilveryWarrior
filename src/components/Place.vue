<template>
  <div class="place">

      <City
        v-if="cell.kind === 'city'"
        :cell="cell"
        @sleep="sleep"
        @buyItem="buyItem"
      />
      <transition-group tag="ul" name="listAppear" class="enemies" v-if="currentCellMobs.length > 0" appear>
        <li
          v-for="enemy in currentCellMobs"
          v-if="enemy.currentLife > 0"
          @click="attack(enemy)"
          class="enemy"
          :key="enemy.id"
        >
          <div class="enemy-picture">{{ enemy.picture }}</div>
          <div class="enemy-life">
            <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut">
              <circle class="donut-ring" cx="21" cy="21" r="16" fill="transparent" stroke="#000" stroke-width="9"></circle>
              <circle class="donut-ring" cx="21" cy="21" r="16" fill="transparent" stroke="#fff" stroke-width="5"></circle>
              <circle class="donut-segment" cx="21" cy="21" r="16" fill="transparent" stroke="#000" stroke-width="5" :stroke-dasharray="lifeCss(enemy.currentLife, enemy.life)" stroke-dashoffset="0"></circle>
            </svg>
          </div>
          <div class="life">
            <div class="value">
              <span class="enemy-name">{{ enemy.name }}</span><br>
              <span>{{ enemy.currentLife }}/{{ enemy.life }}</span>
            </div>
          </div>
        </li>
      </transition-group>
      {{ cell.players }}

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
    lifeCss: function (value, max) {
      const l = (value / max) * 100;
      return `${l} ${100 - l}`;
    },
    attack: function(enemyId) {
      this.$emit('attack', enemyId)
    },
    sleep: function() {
      this.$emit('sleep')
    },
    buyItem: function(item) {
      this.$emit('buyItem',item)
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
<style scoped>
  .place {
    transform: translateZ(1px);
  }
  .donut-segment {
    transition: all 0.5s cubic-bezier(0, 0.9, 0.6, 1);
  }
</style>

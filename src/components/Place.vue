<template>
  <div class="place">
    <ul class="enemies">
      <li v-for="enemy in cell.enemies"
        v-if="cell.enemies && enemy.life > 0"
        @click="attack(enemy)"
        :key="enemy.uid"
        class="enemy"
      >
        <div class="enemy-picture">👾</div>
        <div class="life" :style="lifeCss(enemy.currentLife, enemy.life)">
          <div class="value">
            <span class="enemy-name">{{ enemy.name }}</span><br>
            <span>{{ enemy.currentLife }}/{{ enemy.life }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Place',
  props: {
    cell: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    lifeCss: function (value, max) {
      const l = (value / max) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    },
    attack: function(enemy) {
      this.$emit('attack', enemy)
    }
  }
}
</script>

<style lang="scss" src="../assets/place.scss" scoped></style>

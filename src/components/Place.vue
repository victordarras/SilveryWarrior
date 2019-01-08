<template>
  <ul>
    <li v-for="enemy in cell.enemies"
      v-if="cell.enemies && enemy.life > 0"
      @click="attack(enemy)"
      :key="enemy.uid"
      :title="{enemy}"
      class="enemy"
    >
      <span style="font-size: 3rem">👾</span><br>
      <strong class="name">{{ enemy.name }}</strong><br>
      <div :style="lifeCss(enemy.life)" class="life">{{ enemy.life }}/100</div>
    </li>
  </ul>
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
    lifeCss: function (l) {
      return `background-image: linear-gradient(to right, darkgreen, darkgreen ${l-.01}%, transparent ${l}%, transparent )`
    },
    attack: function(enemy) {
      this.$emit('attack', enemy)
    }
  }
}
</script>

<style scoped>
  ul {
    list-style: none;
    margin: 10px;
    padding: 0;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
  .enemy {
    height: 32vh;
    width: 20vh;
    background: url('../assets/images/card.png') no-repeat center / contain;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1;
    text-align: center;
  }
  .enemy:hover {
    box-shadow: inset 0 0 0 2px #fff;
  }
</style>

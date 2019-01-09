<template>
  <ul>
    <li v-for="enemy in cell.enemies"
      v-if="cell.enemies && enemy.life > 0"
      @click="attack(enemy)"
      :key="enemy.uid"
      class="enemy"
    >
      <div class="enemy-picture">👾</div>
      <div class="life"></div>
      <div :style="lifeCss(enemy.life)">
        <strong class="name">{{ enemy.name }}</strong><br>
        {{ enemy.life }}/100
      </div>
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
      return `background-image: linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2) ${l-.01}%, transparent ${l}%, transparent )`
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
    height: 29vh;
    width: 20vh;
    display: grid;
    grid-template-rows: 16vh 1fr 9vh;
    align-items: center;
    background: url('../assets/images/card.png') no-repeat center / contain;
    padding: 1vh 2.5vh;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1;
    text-align: center;
  }
  .enemy:hover {
    box-shadow: inset 0 0 0 2px #fff;
  }
  .enemy-picture {
    font-size: 3rem;
  }
</style>

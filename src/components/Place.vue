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
        <div class="life"></div>
        <div :style="lifeCss(enemy.life)">
          <span class="name">{{ enemy.name }}</span><br>
          <span class="life">{{ enemy.life }}/100</span>
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
    lifeCss: function (l) {
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, transparent ${l}%, transparent )`
    },
    attack: function(enemy) {
      this.$emit('attack', enemy)
    }
  }
}
</script>

<style scoped>
  .place {
    position: relative;
    list-style: none;
    margin: 10px;
    padding: 0;
    grid-area: place;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }

  .place:before {
    content:"";
    position: absolute;
    /*930x23*/
    height: 23px;
    top: -31px;
    right: -10px;
    left: -15px;
    background: url(../assets/images/horizontal_separator.png) repeat-x top left / contain;
    mix-blend-mode: darken;
  }

  .enemy {
    height: 250px;
    width: 172px;
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

  .name, .life {
    mix-blend-mode: difference;
    color: #fff;
  }
</style>

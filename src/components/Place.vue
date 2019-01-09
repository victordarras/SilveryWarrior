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
            <span class="lifeValue">{{ enemy.name }}</span><br>
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
  .enemies {
    display: flex;
    flex-flow: row wrap;
  }
  .enemy {
    height: 250px;
    width: 172px;
    margin: 0 1.5vh;
    display: grid;
    grid-template-rows: 16vh 9vh;
    align-items: center;
    background: url('../assets/images/card.png') no-repeat center / contain;
    padding: 1.6vh 2.6vh 3vh 2vh;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1;
    text-align: center;
    transition: all 0.16s ease-in-out;
  }
  .enemy:hover {
    transform: scale(1.05)
  }

  .enemy:active {
    transition: none;
    transform: scale(0.95)
  }

  .enemy-picture {
    font-size: 3rem;
  }

  .life {
    color: #fff;
    margin: 4px 8px 0px 4px;
    border-radius: 2px;
  }
  .lifeValue {
    mix-blend-mode: difference;
  }


</style>

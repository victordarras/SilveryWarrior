<template>
  <section class="Fight" :class="{'Enemy__isAttacking': isAttacking}">
    <div class="Fight__arena" >
      <div class="Fight__player">Player</div>

      <transition
        name="listAppear"
        appear
      >
        <div
          class="Enemy"
          :key="enemy.id"
          v-if="enemy.currentLife > 0"
        >
          <img class="Enemy__picture" :src="`/images/mobs/${currentMob.picture}`" />
          <div class="Enemy__life" :style="lifeCss(enemy)"></div>
          <div class="Enemy__label">{{ currentMob.name }}</div>
        </div>
      </transition>
    </div>
    <div v-if="enemy.currentLife > 0">
      <button @click="$emit('quit')">Fuir</button>
      <button @click="attack">Attaquer</button>
    </div>
    <div v-else>
      <button @click="$emit('quit')">Bien</button>
    </div>
  </section>
</template>
<script>
  export default {
    data: () => {
      return {
        isAttacking: false
      }
    },
    props: {
      enemy: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      attack() {
        this.$emit('attack');
        this.isAttacking = true
        window.setTimeout(()=>{
          this.isAttacking = false
        }, 300)

      },
      lifeCss () {
        const l = (this.enemy.currentLife / this.currentMob.life) * 100;
        return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
      },
    },
    computed: {
      mobs() {
        return this.$store.getters.getMobs;
      },
      currentMob() {
        return this.mobs.find(mob => mob.id === this.enemy.uid);
      }
    }
  }
</script>

<style lang="scss" src="../assets/enemies.scss" scoped></style>
<style lang="scss" scoped>
  .Fight {
    text-align: center;
    &__arena {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 5vh;
      margin-bottom: 5vh;
      background:
        radial-gradient(#FFF, #FFF, #eee),
        transparent url(../assets/images/fight-bg.png) center / cover;
      background-blend-mode: darken, darken;
      padding: 5rem 1rem 2rem;
    }
    &__player {
      animation: floating 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }
    &__isAttacking &__player{
      transform: translateX(100%);
    }
    &__isAttacking .Enemy{
      animation: none;
      transform: translateX(10%);
      background: #222
    }
  }
  .Enemy {
    & /deep/ img {
      animation: floating 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }
  }
  @keyframes floating {
    50% {
      transform: translateX(-3%) skew(2deg);
    }
  }
</style>

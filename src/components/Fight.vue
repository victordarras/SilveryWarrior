<template>
  <section class="Fight" :class="{'Fight--isAttacking': isAttacking}">
    <div class="Fight__arena" >

      <transition
        name="fadeLeft"
        :duration="1000"
        appear
      >
        <div class="Player">
          <img class="Player__picture" :src="`/images/mobs/pot.png`" />
        </div>
      </transition>

      <transition
        name="fadeRight"
        :duration="1000"
        appear
      >
        <div
          class="Enemy"
          v-if="enemy.currentLife > 0"
        >
          <img class="Enemy__picture" :src="`/images/mobs/${currentMob.picture}`" />
        </div>
      </transition>
    </div>

    <h1 class="PageTitle">Combat</h1>

    <div class="row">
      <div class="col">
        <h2 class="PageSubTitle">{{ player.name }}</h2>
        <div class="Player__life" :style="lifeCss(player)"></div>
      </div>

      <div class="col">
        <h2 class="PageSubTitle">{{ currentMob.name }}</h2>
        <div class="Enemy__life" :style="lifeCss({...enemy, ...currentMob})"></div>
      </div>
    </div>
    <br>

    <div v-if="enemy.currentLife > 0">
      <Logger />
      <button @click="$emit('quit')">Fuir</button>
      <button @click="attack">Attaquer</button>
      <button @click="attackAnimation">Togl</button>
    </div>
    <div v-else>
      <button @click="$emit('quit')">Bien</button>
    </div>
  </section>
</template>
<script>
import Logger from './Logger'

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
    attackAnimation() {
      this.isAttacking = true
      window.setTimeout(()=>{
        this.isAttacking = false
      }, 300)
    },
    attack() {
      this.attackAnimation();
      this.$emit('attack');
    },
    lifeCss (e) {
      const l = (e.currentLife / e.life) * 100;
      return `background-image: linear-gradient(to right, black, black ${l-.01}%, #fff ${l}%, #fff )`
    },
  },
  computed: {
    player() {
      return this.$store.getters.getPlayer;
    },
    mobs() {
      return this.$store.getters.getMobs;
    },
    currentMob() {
      return this.mobs.find(mob => mob.id === this.enemy.uid);
    }
  },
  components: {
    Logger
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/variables';
  @import '../assets/enemies.scss';

  .row {
    display: flex;
    align-items: center;
    justify-content: stretch;
    .col {
      flex: 1 0 auto;
    }
  }

  .Fight {
    text-align: center;
    &__arena {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 5vh;
      background:
        radial-gradient(#FFF, #FFF, #eee),
        transparent url(../assets/images/fight-bg.png) center / cover;
      background-blend-mode: darken, darken;
      padding: 4rem 1rem 2rem;
      animation: fadeTop .3s ease-in;
    }

    button {
      display: block;
      margin: 1vh auto;
      font-size: 2em;
    }
  }

  .Player {
    @extend .Enemy;
    &__life {
      @extend .Enemy__life;
    }
  }

  .Player, .Enemy {
    background: none;
  }

  .Player__picture,
  .Enemy__picture {
    @include idle;
    mix-blend-mode: normal !important;
  }

  .Fight--isAttacking {

    .Fight__arena {
      // animation: shake-horizontal .3s;
      animation-delay: .2s;
    }

    .Player__picture {
      animation: playerAttack 0.3s;
    }
    .Enemy__picture {
      animation: enemyAttack 0.15s;
      animation-delay: .15s;
    }
  }


</style>
<style>


  .fadeRight-enter-active, .fadeRight-leave-active {
    transition-delay: .5s !important;
    transition: .5s !important;
  }
  .fadeRight-enter, .fadeRight-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0 !important;
    transform: translateX(100%) !important;
  }

  .fadeLeft-enter-active, .fadeLeft-leave-active {
    transition-delay: .5s !important;
    transition: .5s !important;
  }
  .fadeLeft-enter, .fadeLeft-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0 !important;
    transform: translateX(-100%) !important;
  }

  .fadeTop-enter-active, .fadeTop-leave-active {
    transition-delay: .5s !important;
    transition: .5s !important;
  }
  .fadeTop-enter, .fadeTop-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0 !important;
    transform: translateX(-100%) !important;
  }
</style>

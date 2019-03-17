<template>
  <section class="Fight" :class="{'Enemy__isAttacking': isAttacking}">
    <div class="Fight__arena" >
      <div class="Fight__player">

        <div
          class="Enemy"
        >
          <img class="Enemy__picture" :src="`/images/mobs/pot.png`" />
          <div class="Enemy__life" :style="lifeCss(player)"></div>
          <div class="Enemy__label">{{ player.name }}</div>
        </div>
      </div>

      <transition
        name="listAppear"
        appear
      >
        <div
          class="Enemy"
          v-if="enemy.currentLife > 0"
        >
          <img class="Enemy__picture" :src="`/images/mobs/${currentMob.picture}`" />
          <div class="Enemy__life" :style="lifeCss(enemy)"></div>
          <div class="Enemy__label">{{ currentMob.name }}</div>
        </div>
      </transition>
    </div>
    <h1 class="PageTitle">Combat</h1>
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
        }, 1000)

      },
      lifeCss () {
        const l = (this.enemy.currentLife / this.currentMob.life) * 100;
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
    }
  }
</script>

<style lang="scss" src="../assets/enemies.scss" scoped></style>
<style lang="scss" scoped>
  button {
    display: block;
    margin: 1vh auto;
    font-size: 2em;
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
    }
    &__player img {
      animation: hanging 1s linear infinite;
    }
  }

  .Enemy {
    background: none !important;
    img {
      mix-blend-mode: normal !important;
      animation: hanging 1s linear infinite;
      animation-delay: 1s;
    }
  }

  .Fight__isAttacking {
    .Fight__player {
      animation: playerAttack 1000ms linear infinite both;
    }
    .Enemy {
      animation: playerAttack 1000ms linear infinite reverse;
    }
  }

</style>

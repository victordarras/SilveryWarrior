<template>
  <section class="Fight">
    <div class="Fight__arena">
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
      <button @click="$emit('attack')">Attaquer</button>
    </div>
    <div v-else>
      <button @click="$emit('quit')">Bien</button>
    </div>
  </section>
</template>
<script>
  export default {
    props: {
      enemy: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
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
      background: radial-gradient(#FFF, #FFF, #eee);
      padding: 5rem 1rem 2rem;
    }
  }
</style>

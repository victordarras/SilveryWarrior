<template>
  <section class="MobEditor">
    <h1>Mob Editor</h1>
    <ul class="mob-list">
      <li
        v-for="mob in mobs"
        :key="mob.name"
        @click="currentMob = mob"
        :class="mob === currentMob ? 'current' : ''"
      >
        {{ mob.name }}
      </li>
    </ul>
    <form @submit="updateMob()" :style="isLoading ? 'opacity:0.5;' : ''">
      <img :src="pictureURL(currentMob.picture)" alt="nope" width="140" height="140" class="picture">
      <h2>{{ currentMob.name }}</h2>({{ currentMob.id }})
      <hr>
      <div v-for="key in Object.keys(currentMob)" :key="key" v-if="key !== 'id'">
        <label :for="key">{{ key }}:</label>
        <input v-if="typeof currentMob[key] === 'boolean'" type="checkbox" v-model="currentMob[key]">
        <input v-else-if="typeof currentMob[key] === 'number'" type="number" v-model.number="currentMob[key]">
        <input v-else type="text" v-model="currentMob[key]">
      </div>
    </form>
    <button class="button" @click="updateMob(currentMob)">Save mob</button>
    <button @click="addStats()">Add stats</button>
  </section>
</template>

<script>

export default {
  name: 'MobEditor',
  data: () => {
    return {
      isLoading: true,
      mobs: [],
      currentMob: {}
    }
  },
  methods: {
    pictureURL(img) {
      return `/images/mobs/${img}`
    },
    addStats() {
      this.mobs = this.mobs.map(mob => {
        return {
          ...mob,
          "money": 10
        }
      })
    },
    updateMob() {
      this.isLoading = true;
      (async () => {
        await this.$fetch.patch('http://192.168.1.110:3000/mobs/' + this.currentMob.id, this.currentMob)
        this.isLoading = false;
      })()
    }
  },
  created () {
    this.isLoading = true;
    (async () => {
      let mobs = await this.$fetch.get('http://192.168.1.110:3000/mobs')
      this.mobs = await mobs.json();

      this.currentMob = this.mobs[0]
      this.isLoading = false;
    })()
  }
}
</script>

<style lang="scss" scoped>
  .MobEditor {
    padding: 0 2em;
  }
  .picture {
    float: left;
    border: 2px solid #222;
    margin: 0 1em 1em 0;
  }
  label {
    display: inline-block;
    width: 6em;
  }
  input {
    font-size: 1em;
    padding: 0.125em 0.25em;
    margin-bottom: 0.5em;
    border: 1px solid #EEE;
    border-bottom-color: #555;
    &:focus {
      border-bottom-color: tomato;
    }
  }
  .mob-list {
    float: left;
    margin-right: 2rem;
    padding-right: 2rem;
    border-right: 1px solid #333;
    height: 90vh;
    li {
      padding: 0.125em 0.5em;
    }
    li.current {
      border-left: 5px solid #000;
    }
  }
</style>

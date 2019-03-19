<template>
  <section class="Admin">
    <h1>Mob Editor</h1>
    <div class="left">
      <table v-if="mobs.length">
        <thead>
          <tr>
            <th v-for="key in Object.keys(mobs[0])" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="mob in mobs"
            @click="currentMob = mob"
            :class="mob === currentMob ? 'highlight' : ''"
            :key="mob.id"
          >
            <td v-for="key in Object.keys(mob)" :key="key">
              {{mob[key]}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="right">
      <form @submit.prevent="updateMob()" :style="isLoading ? 'opacity:0.5;' : ''">
        <img :src="pictureURL(currentMob.picture)" alt="nope" width="140" height="140" class="picture">
        <h2>{{ currentMob.name }}</h2>({{ currentMob.id }})
        <hr>
        <div v-for="key in Object.keys(currentMob)" :key="key" v-if="key !== 'id'">
          <label :for="key">{{ key }}:</label>
          <input v-if="typeof currentMob[key] === 'boolean'" type="checkbox" v-model="currentMob[key]">
          <input v-else-if="typeof currentMob[key] === 'number'" type="number" v-model.number="currentMob[key]">
          <input v-else type="text" v-model="currentMob[key]">
        </div>
        <button class="button" type="submit">Save mob</button>
        <button @click="addStats()">Add stats</button>
      </form>
    </div>
  </section>
</template>

<script>
import API from "../api"

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
        await API.patch('/mobs/' + this.currentMob.id, this.currentMob)
        this.isLoading = false;
      })()
    }
  },
  created () {
    this.isLoading = true;
    (async () => {
      let mobs = await API.get('/mobs')
      this.mobs = await mobs.data;

      this.currentMob = this.mobs[0]
      this.isLoading = false;
    })()
  }
}
</script>
<style lang="scss" src="../assets/admin.scss" scoped></style>

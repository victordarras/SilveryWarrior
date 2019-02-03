import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'

const API = axios.create({
    baseURL: `http://localhost:3000`,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
})

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {
    mobs: [],
    cells: []
  },
  mutations: {
    setMobs(state, mobs) { state.mobs = mobs },
    setCells(state, cells) { state.cells = cells },
    updateCell(state, cell) { state.cells[state.cells.indexOf(cell)] = cell }
  },
  actions: {
    loadMobs() {
      API.get('/mobs').then(res => {
        this.commit("setMobs", res.data)
      })
    },
    loadCells() {
      API.get('/cells').then(res => {
        this.commit("setCells", res.data)
      })
    },
    updateCell(state, cell) {
      API.patch('http://localhost:3000/cells/' + cell.id, cell).then(() => {
        this.commit("updateCell", cell)
      })
    }
  },
  getters: {
    getMobs: state => state.mobs,
    getCells: state => state.cells
  }
});

export default store;

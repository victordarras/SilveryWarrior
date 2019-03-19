import Vuex from 'vuex'
import Vue from 'vue'
import API from "./api"

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {
    mobs: [],
    cells: [],
    player: {},
    logs: []
  },
  mutations: {
    setMobs(state, mobs) { state.mobs = mobs },
    setCells(state, cells) { state.cells = cells },
    updateCell(state, cell) { state.cells[state.cells.indexOf(cell)] = cell },
    updatePlayer(state, player) { state.player = player },
    addLog(state, log) { state.logs.push(log) },
    clearLogs(state) { state.logs = [] }
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
    updateCell(context, cell) {
      API.patch('/cells/' + cell.id, cell).then(() => {
        this.commit("updateCell", cell)
      })
    },
    updatePlayer(context, player) {
      API.patch('/players/' + player.id, player).then(() => {
        this.commit("updatePlayer", player)
      })
    },
    addLog(context, log) {
      this.commit("addLog", log)
    },
    clearLogs() {
      this.commit("clearLogs")
    }
  },
  getters: {
    getMobs: state => state.mobs,
    getCells: state => state.cells,
    getPlayer: state => state.player,
    getLogs: state => state.logs
  }
});

export default store;

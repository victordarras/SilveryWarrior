import Vue from 'vue'
import VueFetch from 'vue-fetch'
import VueRouter from 'vue-router'
import App from './components/App.vue'
import Game from './components/Game.vue'
import MobEditor from './components/MobEditor.vue'
import MapEditor from './components/MapEditor.vue'

Vue.config.productionTip = false

Vue.use(VueFetch)
Vue.use(VueRouter)

const routes = [
  {
    path: '/game',
    component: Game
  }, {
    path: '/mob-editor',
    component: MobEditor
  }, {
    path: '/map-editor',
    component: MapEditor
  }
]
const router = new VueRouter({routes})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

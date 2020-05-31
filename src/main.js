import Vue from 'vue'
import VueFetch from 'vue-fetch'
import VueRouter from 'vue-router'
import store from './store'
import App from './components/App.vue'
import Game from './components/Game.vue'
import MobEditor from './components/MobEditor.vue'
import MapEditor from './components/MapEditor.vue'
import ItemEditor from './components/ItemEditor.vue'

Vue.config.productionTip = false

Vue.use(VueFetch)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Game
  },
  {
    path: '/menu',
    component: App
  }, {
    path: '/mob-editor',
    component: MobEditor
  }, {
    path: '/map-editor',
    component: MapEditor
  }, {
    path: '/item-editor',
    component: ItemEditor
  }
]
const router = new VueRouter({routes})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueFetch from 'vue-fetch'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueFetch)

new Vue({
  render: h => h(App)
}).$mount('#app')

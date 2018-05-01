import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import View from './View.vue'
import Autocomplete from 'v-autocomplete'

Vue.use(Autocomplete)

const app = new Vue({
  el: '#app',
  data: function () {
    return {
      path: window.location.hash.slice(1)
    }
  },
  methods: {
    changePath: function (path) {
      window.location.hash = path
    }
  },
  render: function (h) {
    switch (this.path) {
      case '':
        return h(App, {
          on: {
            path: this.changePath
          }
        })
      default:
        return h(View, {
          props: {
            pkgName: this.path
          },
          on: {
            path: this.changePath
          }
        })
    }
  }
})

// called when doing history back/forward
window.addEventListener('hashchange', (event) => {
  app.path = window.location.hash.slice(1)
})

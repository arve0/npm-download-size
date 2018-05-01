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
      path: window.location.hash.slice(1),
      error: "",
    }
  },
  methods: {
    changePath: function (path) {
      window.location.hash = path
    },
    handleError: function (error) {
      console.error(error)
      this.error = error.message
      this.changePath("")
    },
    getEmitHandlers: function () {
      return {
        error: this.handleError,
        path: this.changePath
      }
    }
  },
  render: function (h) {
    switch (this.path) {
      case '':
        return h(App, {
          props: {
            error: this.error
          },
          on: this.getEmitHandlers()
        })
      default:
        return h(View, {
          props: {
            pkgName: this.path
          },
          on: this.getEmitHandlers()
        })
    }
  }
})

// called when doing history back/forward
window.addEventListener('hashchange', (event) => {
  app.path = window.location.hash.slice(1)
})

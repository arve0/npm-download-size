import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import View from './View.vue'

let pathPrefix = ''
if (process.env.NODE_ENV === 'production') {
  pathPrefix = '/npm-download-size'
}

const app = new Vue({
  el: '#app',
  data: function () {
    return {
      path: window.location.pathname
    }
  },
  methods: {
    changePath: function (path) {
      this.path = pathPrefix + path
      window.history.pushState(null, null, this.path)
    }
  },
  render: function (h) {
    switch (this.path) {
      case pathPrefix + '/':
        return h(App, {
          on: {
            path: this.changePath
          }
        })
      default:
        return h(View, {
          props: {
            pkgName: this.path.replace(pathPrefix, '').slice(1)
          },
          on: {
            path: this.changePath
          }
        })
    }
  }
})

// called when doing history back/forward
window.addEventListener('popstate', (event) => {
  app.path = window.location.pathname
})

<template>
  <div id="app">
    <h1>npm download size</h1>
    <p class="lead">Analyse download size and dependencies of npm packages.</p>
    <p>Enter a package name below and press enter!</p>
    <v-autocomplete
      :wait="300"
      :min-len="2"
      :keep-open="true"
      :items="suggestions"
      :get-label="getLabel"
      :component-item='template'
      :input-attrs="{ autofocus: 'true' }"
      @update-items="updateItems"
      @item-selected="go"
      @enter="go"
    />
    <div>
      <p class="alert" v-if="alert">{{alert}}</p>
    </div>
    <div id=popular>
      <h2>Popular packages</h2>
      <a href="#request">request</a>,
      <a href="#chalk">chalk</a>,
      <a href="#express">express</a>,
      <a href="#browserify">browserify</a>,
      <a href="#parcel">parcel</a>,
      <a href="#webpack">webpack</a>,
      <a href="#react">react</a>,
      <a href="#moment">moment</a>,
      <a href="#express">express</a>,
      <a href="#lodash">lodash</a>,
      <a href="#async">async</a>,
      <a href="#forever">forever</a>
    </div>
  </div>
</template>

<script>
import Suggestion from './Suggestion.vue'

export default {
  name: 'app',
  props: ['error'],
  data () {
    return {
      input: '',
      prevName: '',
      notFound: false,
      errMsg: this.error,
      suggestions: [],
      template: Suggestion
    }
  },
  computed: {
    alert: function () {
      if (this.notFound) {
        return `${this.input} is not found in npm registry`
      }
      return this.errMsg
    },
    name: function () {
      let firstAt = this.input.indexOf('@')
      let lastAt = this.input.lastIndexOf('@')

      if (firstAt !== lastAt || lastAt > 0) {
        return this.input.substring(0, lastAt)
      } else {
        return this.input
      }
    },
    version: function () {
      let lastAt = this.input.lastIndexOf('@')

      if (lastAt > 0) {
        return this.input.substring(lastAt)
      } else {
        return ''
      }
    },
  },
  methods: {
    updateItems: function (value) {
      this.input = value
      if (this.name === this.prevName) {
        return
      }
      this.notFound = false
      this.errMsg = false
      if (value === '') {
        return
      }
      this.getSuggestions(this.name).then(() => {
        this.notFound = this.suggestions.length === 0
        if (this.suggestions.length === 1) {
          this.go()
        }
      })
      this.prevName = this.name
    },
    getLabel: function (item) {
      return (item && item.package && item.package.name + this.version) || ""
    },
    go: function (item) {
      if (this.alert) {
        return
      }
      if (typeof item === "object") {
        this.$emit('path', this.getPath(item.package.name))
      } else {
        this.$emit('path', this.getPath(this.name))
      }
    },
    getSuggestions: async function (value) {
      let uri = `https://api.npms.io/v2/search/suggestions?q=${value}`
      await fetch(uri)
        .then(r => r.json())
        .then(r => this.suggestions = r || [])
        .catch(err => this.$emit('error', err))
    },
    getPath: function (name) {
      return this.uriEncodePkgName(name + this.version)
    },
    uriEncodePkgName: (pkgname) => pkgname.replace('/', '%2f')
  }
}

</script>

<style>
div.v-autocomplete {
  display: inline-block;
  max-width: 100%;
}
input {
  margin-top: 5%;
  max-width: 100%;
  box-sizing: border-box;
}
button {
  margin-top: 0.5em;
}
input, button {
  font-size: 2.5em;
  padding: 0.3em;
  border-style: solid;
  border-width: 1px;
  border-radius: 0.1em;
}
input:focus, button:focus {
  outline: none;
  box-shadow: 0 0 3pt 1pt lightgreen;
}
.v-autocomplete-list {
  margin-top: 1em;
}
.v-autocomplete-list-item {
  margin-right: 0.8em;
}
.v-autocomplete-item-active {
  font-weight: bold;
  cursor: pointer;
}
.alert {
  margin-top: 2em;
  background-color:indianred;
  display: inline-block;
  padding: 0.5em;
  font-size: 1.5em;
  border-radius: 0.1em;
}
#popular h2 {
  margin-top: 3em;
}
</style>

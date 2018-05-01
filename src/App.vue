<template>
  <div id="app">
    <h1>npm download size</h1>
    <p class="lead">Analyse download size and dependencies of npm packages.</p>
    <p>Enter a package name below and press enter!</p>
    <v-autocomplete
      :wait="300"
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
      <h2>Popular libraries</h2>
      <a href="#lodash">lodash</a>,
      <a href="#request">request</a>,
      <a href="#async">async</a>,
      <a href="#chalk">chalk</a>,
      <a href="#express">express</a>,
      <a href="#bluebird">bluebird</a>,
      <a href="#commander">commander</a>,
      <a href="#debug">debug</a>,
      <a href="#react">react</a>,
      <a href="#moment">moment</a>,
      <a href="#underscore">underscore</a>,
      <a href="#mkdirp">mkdirp</a>
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
    }
  },
  methods: {
    updateItems: function (value) {
      this.input = value
      this.notFound = false
      this.errMsg = false
      if (value === '') {
        return
      }
      this.getSuggestions(value).then(() => {
        this.notFound = this.suggestions.length === 0
        if (this.suggestions.length === 1) {
          this.go()
        }
      })
    },
    getLabel: function (item) {
      return (item && item.name) || ""
    },
    go: function (item) {
      if (this.alert) {
        return
      }
      if (typeof item === "object") {
        this.input = item.name
      } else if (typeof item === "string") {
        this.input = item
      }
      this.$emit('path', this.uriEncodePkgName(this.input))
    },
    getSuggestions: async function (value) {
      let uri = this.cors(`https://www.npmjs.com/search/suggestions?q=${value}`)
      await fetch(uri)
        .then(r => r.json())
        .then(r => this.suggestions = r || [])
        .catch(err => this.$emit('error', err))
    },
    cors: (url) => `https://cors.seljebu.no/` + url,
    uriEncodePkgName: (pkgname) => pkgname.replace('/', '%2f')
  }
}

</script>

<style>
div.v-autocomplete {
  display: inline-block;
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

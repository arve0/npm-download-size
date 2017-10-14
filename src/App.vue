<template>
  <div id="app">
    <h1>npm download size</h1>
    <p class="lead">Analyse download size and dependencies of npm packages.</p>
    <p>Enter a package name below and press enter!</p>
    <input type=text v-model="input" @keyup.enter="go">
    <button @click="go">Go!</button>
    <div>
      <p class="alert" v-if="alert !== ''">{{alert}}</p>
    </div>
  </div>
</template>

<script>
import debounce from 'debounce'

export default {
  name: 'app',
  data () {
    return {
      input: '',
      notFound: false
    }
  },
  computed: {
    alert: function () {
      if (this.notFound) {
        return `${this.input} is not found in npm registry`
      }
      return ''
    }
  },
  watch: {
    input: function (value) {
      this.notFound = false
      if (value === '') {
        return
      }
      this.checkIfFound(value)
    }
  },
  methods: {
    go: function () {
      if (this.notFound) {
        return
      }
      this.$emit('path', `/${this.input}`)
    },
    checkIfFound: debounce(async function (value) {
      let uri = `https://cors.seljebu.no/https://registry.npmjs.org/${value}/latest`
      let pkg = await fetch(uri)
      this.notFound = pkg.status !== 200
    }, 300)
  }
}

</script>

<style scoped>
input {
  margin-top: 2em;
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
.alert {
  margin-top: 2em;
  background-color:indianred;
  display: inline-block;
  padding: 0.5em;
  font-size: 1.5em;
  border-radius: 0.1em;
}
</style>

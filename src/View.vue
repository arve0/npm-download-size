<template>
  <div id=view>
    <div v-if="!pkg" class=loading>
      {{spinner}} Loading, please wait.
    </div>
    <div v-if="pkg">
      <dep-component :pkg=pkg :parent=pkg />
      <div v-if="pkg.dependencies.length">
        <h1>Dependencies</h1>
        <dep-component
          v-for="dep in deps"
          :key="dep.name"
          :pkg=dep
          :parent=pkg
          @goto="goTo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Dep from './Dep.vue'

export default {
  props: ['pkgName'],
  components: {
    'dep-component': Dep
  },
  data: function () {
    return {
      pkg: null,
      spinner: '⠋',
      spinners: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }
  },
  computed: {
    deps: function () {
      return this.pkg && this.pkg.dependencies.sort((a, b) => b.size - a.size)
    },
  },
  methods: {
    getPkg: function () {
      this.spin()
      this._interval = setInterval(this.spin, 100)
      let uri = `https://api.seljebu.no/download-size/${this.pkgName}`
      fetch(uri).then(res => {
        if (res.status === 404) {
          this.$emit('error', new Error(`Package "${this.pkgName}" not found.`))
          return
        } else if (res.status === 500) {
          res.text().then(err => {
            this.$emit('error', new Error(err))
          })
          return
        }
        return res.json()
      }).then(res => {
        clearInterval(this._interval)
        this.pkg = res
      }).catch(err => this.$emit('error', err))
    },
    goTo: function (pkgName) {
      this.pkg = null
      this.$emit('path', `${pkgName}`)
    },
    spin: function () {
      this.spinner = this.spinners.shift()
      this.spinners.push(this.spinner)
    }
  },
  created: function () {
    this.getPkg()
  },
  watch: {
    pkgName: function () {
      this.getPkg()
    }
  }
}

</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 20%;
  font-size: 200%;
}
h1 {
  margin: 0.5em;
  margin-bottom:0;
}
</style>

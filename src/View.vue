<template>
  <div id=view>
    <div v-if="!pkg" class=loading>
      {{spinner}} Loading, please wait.
    </div>
    <div v-if="pkg">
      <pkg :pkg=pkg />
      <div v-if="pkg.dependencies.length">
        <h1>Dependencies</h1>
        <div class="deps">
          <dep
            v-for="dep in deps"
            :key="dep.name"
            :pkg=dep
            :parent=pkg
            @goto="goTo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dep from './Dep.vue'
import Pkg from './Pkg.vue'

export default {
  props: ['pkgName'],
  components: {
    'dep': Dep,
    'pkg': Pkg,
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
          let spec = this.pkgName.replace('%2f', '/')
          this.$emit('error', new Error(`"${spec}" not found.`))
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
      this.$emit('path', this.uriEncodePkgName(pkgName))
    },
    spin: function () {
      this.spinner = this.spinners.shift()
      this.spinners.push(this.spinner)
    },
    uriEncodePkgName: (pkgname) => pkgname.replace('/', '%2f')
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
.deps {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.deps > * {
  flex-grow: 1;
  flex-basis: 0;
}
</style>

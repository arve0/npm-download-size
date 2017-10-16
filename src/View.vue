<template>
  <div id=view  v-if="pkg">
    <dep-component :pkg=pkg :parent=pkg />
    <h1>Dependencies</h1>
    <dep-component
      v-for="dep in deps"
      :key="dep.name"
      :pkg=dep
      :parent=pkg
      @goto="goTo"
    />
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
      pkg: null
    }
  },
  computed: {
    deps: function () {
      return this.pkg && this.pkg.dependencies.sort((a, b) => b.size - a.size)
    },
  },
  methods: {
    getPkg: function () {
      let uri = `https://api.seljebu.no/download-size/${this.pkgName}`
      fetch(uri).then(res => {
        if (res.status !== 200) {
          window.history.back()  // TODO: show warning
          return
        }
        return res.json()
      }).then(res => {
        this.pkg = res
      })
    },
    goTo: function (pkgName) {
      this.pkg = null
      this.$emit('path', `/${pkgName}`)
    },
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
#view {
  padding: 1em;
}
h1 {
  margin-bottom:0;
}
</style>

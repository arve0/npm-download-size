<template>
  <div id=view  v-if="pkg">
    <h1>{{pkgName}}</h1>
    <table>
      <tr>
        <th>Version</th>
        <td>{{pkg.version}}</td>
      </tr>
      <tr>
        <th>Tarball size</th>
        <td>{{pretty(pkg.tarballSize)}}</td>
      </tr>
      <tr>
        <th>Total size</th>
        <td>{{pkg.prettySize}}</td>
      </tr>
      <tr>
        <th>Direct dependencies</th>
        <td>{{directDependencies}}</td>
      </tr>
      <tr>
        <th>Total dependencies</th>
        <td>{{pkg.totalDependencies}}</td>
      </tr>
    </table>
    <div class=deps v-if="deps.first.length">
      <div
        class=dep
        v-for="dep in deps.first"
        :key="dep.name"
        :style="'height:' + dep.percent + '%'"
      >
        <span class=link @click="goTo(dep)">{{dep.name}}
          <span class="tiny">{{dep.version}}</span>
        </span>
        <span class=small>{{dep.prettySize}} ({{dep.percent.toFixed(0)}}%)</span>
      </div>
      <div
        class=dep
        v-if="deps.packed.length"
        :style="'height:' + deps.packPercent + '%'"
      >
        <span>{{deps.packed.map(d => d.name).join(', ')}}</span>
        <span class=small>{{pretty(deps.packSize)}} ({{deps.packPercent.toFixed(0)}}%)</span>
      </div>
    </div>
  </div>
</template>

<script>
import prefix from 'si-prefix'

export default {
  props: ['pkgName'],
  data: function () {
    return {
      pkg: null
    }
  },
  computed: {
    directDependencies: function () {
      return this.pkg && this.pkg.dependencies.length
    },
    sortedDeps: function () {
      return this.pkg && this.pkg.dependencies.sort((a, b) => b.size - a.size)
    },
    deps: function () {
      if (!this.pkg) {
        return
      }
      let height = window.innerHeight
      let totalSize = this.sortedDeps.reduce((s, d) => s + d.size, 0)
      let currentPercent = 0
      return this.sortedDeps.map((d, i) => {
        d.percent = d.size / totalSize * 100
        currentPercent += d.percent
        if (i > 0 && currentPercent > 90 || d.percent < 5) {
          d.pack = true
        }
        return d
      }).reduce((acc, d) => {
        if (d.pack) {
          acc.packed.push(d)
          acc.packPercent += d.percent
          acc.packSize += d.size
        } else {
          acc.first.push(d)
        }
        return acc
      }, { first: [], packed: [], packPercent: 0, packSize: 0 })
    }
    // portrait: function () {
    //   let orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    //   return orientation.slice(0, 8) === 'portrait'
    // },
  },
  methods: {
    pretty: function (size) {
      let converted = size === 0
        ? [0, 'B']  // avoid NaN, https://github.com/mal/si-prefix/issues/1
        : prefix.byte.convert(size)
      let output = converted[0].toFixed(1) + ' ' + converted[1]
      return output
    },
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
    goTo: function (pkg) {
      this.pkg = null
      this.$emit('path', `/${pkg.name}`)
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
table {
  border-collapse: collapse;
  margin-bottom: 1em;
}
th, td {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: black;
}
th {
  text-align: left;
  padding-right: 2em;
}
td {
  text-align: right;
}
.deps {
  height: 100vh;
}
.dep {
  box-sizing: border-box;
  border-style: solid;
  border-width: 1px;
  border-bottom-width: 0;
  border-color: black;
  padding: 0.5em;
  border-collapse:collapse;
  text-align: center;
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
  font-size: 120%;
}
.dep:last-child {
  border-bottom-width: 1px;
}
.link {
  cursor: pointer;
}
.small {
  font-size: 80%;
}
.tiny {
  font-size: 60%;
}
</style>

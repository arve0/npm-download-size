<template>
  <div class=dep>
    <div class="chart">
      <pie-chart
        :ratio=ratio
        :label-small=pretty(size)
      />
    </div>
    <div class="details">
      <h1 class=link @click="$emit('goto', pkg.name)">{{pkg.name}}</h1>
      <table>
        <tr>
          <th>Version</th>
          <td>{{pkg.version}}</td>
        </tr>
        <tr>
          <th>Tarball size</th>
          <td>{{pretty(pkg.tarballSize)}}</td><!-- TODO: percent -->
        </tr>
        <tr>
          <th>Total size</th>
          <td>{{pretty(pkg.size)}}</td>
        </tr>
        <tr v-if="pkg === parent">
          <th>Direct dependencies</th>
          <td>{{pkg.dependencies.length}}</td>
        </tr>
        <tr>
          <th>Total dependencies</th>
          <td>{{pkg.totalDependencies}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import prefix from 'si-prefix'
import PieChart from 'vue-pie-chart'

export default {
  props: ['pkg', 'parent'],
  components: {
    'pie-chart': PieChart
  },
  computed: {
    size: function () {
      return this.pkg !== this.parent
        ? this.pkg.size
        : this.pkg.tarballSize
    },
    ratio: function () {
      return this.size / this.parent.size
    }
  },
  methods: {
    pretty: function (size) {
      let converted = size === 0
        ? [0, 'B']  // avoid NaN, https://github.com/mal/si-prefix/issues/1
        : prefix.byte.convert(size)
      let output = converted[0].toFixed(1) + ' ' + converted[1]
      return output
    },
  }
}
</script>

<style scoped>
.dep {
  display: inline-block;
  border-bottom: 2px solid;
  padding-top: 1em;
  padding-bottom: 1em;
  margin-right: 2em;
}
.chart {
  width: 150px;
  padding: 1em;
  display: inline-block;
}
.details {
  display: inline-block;
  vertical-align: top;
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

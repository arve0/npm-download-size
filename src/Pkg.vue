<template>
    <div class=package>
        <h1 @click=click title="goto npmjs">{{pkg.name}} @ {{pkg.version}}</h1>
        <table>
            <tr>
                <th>Version</th>
                <td>{{pkg.version}}</td>
            </tr>
            <tr>
                <th>Total size</th>
                <td>{{pkg.prettySize}}</td>
            </tr>
            <tr>
                <th>Total dependencies</th>
                <td>{{pkg.totalDependencies}}</td>
            </tr>
            <tr>
                <th>Tarball size</th>
                <td>{{tarballSize}}</td>
            </tr>
            <tr>
                <th>Direct dependencies</th>
                <td>{{pkg.dependencies.length}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import prefix from "si-prefix";

export default {
  props: ["pkg"],
  computed: {
    tarballSize: function() {
      return pretty(this.pkg.tarballSize);
    }
  },
  methods: {
      click: function () {
        window.location.href = `https://npmjs.com/package/${this.pkg.name}`
      }
  }
};

function pretty(size) {
  let converted =
    size === 0
      ? [0, "B"] // avoid NaN, https://github.com/mal/si-prefix/issues/1
      : prefix.byte.convert(size);
  let output = converted[0].toFixed(1) + " " + converted[1];
  return output;
}
</script>

<style scoped>
.package {
    padding: 1em;
}
.package h1 {
    margin-top: 0;
    margin-bottom: 0.3em;
    cursor: pointer;
}
.package table {
    border-collapse: collapse;
    margin-bottom: 1em;
}
.package th, td {
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: black;
}
.package th {
    text-align: left;
    padding-right: 2em;
}
.package td {
    text-align: right;
}
</style>

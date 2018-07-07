<template>
  <div class=dep>
    <bar :ratio=ratio />
    <a class=description :title=title @click=click>{{pkg.name}} @ {{pkg.version}} -- {{pretty(pkg.size)}} ({{pkg.totalDependencies}} deps)</a>
  </div>
</template>

<script>
import prefix from 'si-prefix'
import Bar from './Bar.vue'

export default {
  props: ['pkg', 'parent'],
  components: {
    'bar': Bar,
  },
  computed: {
    isParent: function () {
      return this.pkg === this.parent
    },
    title: function () {
      return this.isParent ? 'view on npmjs' : 'show pkg size'
    },
    size: function () {
      return this.isParent ? this.pkg.tarballSize : this.pkg.size
    },
    ratio: function () {
      return this.size / this.parent.size
    }
  },
  methods: {
    click: function () {
      this.$emit('goto', this.pkg.name)
    },
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
  margin-left: 1em;
  margin-bottom: 0.6em;
}
.description {
  transform: rotate(45deg);
  cursor: pointer;
  white-space: pre;
}
</style>

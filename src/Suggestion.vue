<template>
    <span>{{ item.package.name + this.version }}</span>
</template>

<script>
export default {
  props: {
    item: { required: true },
    searchText: { required: true }
  },
  computed: {
    version: function () {
      let lastAt = this.searchText.lastIndexOf('@')
      return lastAt > 0 ? this.searchText.substring(lastAt) : ''
    }
  }
}
</script>
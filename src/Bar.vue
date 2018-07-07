<template>
  <div class="bar">
      <div class="fill" :style="style"></div>
  </div>
</template>

<script>
export default {
    props: ['ratio'],
    computed: {
        style: function () {
            return 'width: ' + 10 * this.ratio + 'em;'
        }
    }
}
</script>

<style scoped>
.bar {
    width: 10em;
    height: 0.5em;
    background-color: aliceblue;
    position: relative;
    display: inline-block;
    margin-right: 0.1em;
}
.fill {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: cornflowerblue;
}
</style>

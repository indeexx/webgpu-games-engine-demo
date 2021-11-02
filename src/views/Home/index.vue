<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
<h1>啦啦啦</h1>
</template>

<style lang="scss" scoped>
#app{
  h1{
    color: red;
  }
}
</style>
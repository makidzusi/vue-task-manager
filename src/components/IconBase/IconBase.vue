<script setup lang="ts">
import { computed } from "vue";
import sprite from "@/assets/sprites.svg";

export interface Props {
  title: string;
  width: number | string;
  height: number | string;
  color?: string;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const props = withDefaults(defineProps<Props>(), {
  color: 'black'
})
const uri = computed(() => `${sprite}#${props.title}`);
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :color="props.color">
    <use :href="uri"></use>
  </svg>
</template>

<style lang="scss" scoped>
use {
  fill: currentColor;
}
</style>

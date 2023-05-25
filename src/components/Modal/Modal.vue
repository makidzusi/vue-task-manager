<template>
    <Teleport to="body">
        <div class="modal" @click="emits('close')">
            <div class="modal__body" @click.stop.prevent>
                <slot/>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
const emits = defineEmits<{
    (e: 'close') : void
}>()
onMounted(() => {
    document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
    document.body.style.overflow = 'auto'
})
</script>


<style scoped lang="scss" src="./scss/index.scss"/>
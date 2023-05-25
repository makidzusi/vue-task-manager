<template>
    <label class="input">
        <span class="input__label" v-if="props.label">
            {{ props.label }}
        </span>
        <input :type="props.type" v-model="value" class="input__input">
    </label>
</template>

<script setup lang="ts">
import {computed} from 'vue'
const props = withDefaults(defineProps<{
    label: string,
    modelValue: string | number,
    type?: string
}>(), {
    type: 'text'
})

const emits = defineEmits<{
    (e: 'update:modelValue', modelValue: string | number): void
}>()

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})

</script>

<style scoped lang="scss" src="./scss/index.scss"/>
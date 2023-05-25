<template>
    <div class="card">
        <div>
            <div class="card__header">
            <div class="card__header-left">
                <h3 class="card__title">{{ props.card.title }}</h3>
                <IconBase class="card__icon" @click="emits('edit', props.card)" title="note-edit" :height="24" :width="24" color="#71747C"/>
                <IconBase class="card__icon" @click="emits('remove', props.card)"  title="recycle-bin" fill="red" :height="24" :width="24" color="#71747C"/>
            </div>
            <IconBase class="card__icon-drag"  title="menu" :height="24" :width="24" color="#71747C"/>
        </div>

        <span class="card__score">Балл: <span>{{ props.card.score }}</span></span>
        </div>
      

        <Chip v-if="props.card.project">
            {{ translatedProjectName}}
        </Chip>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Project, Task } from '@/types';
import Chip from '@/components/Chip';
import IconBase from '@/components/IconBase';

const props = defineProps<{
    card: Task,
    projects: Project[]
}>()

const translatedProjectName = computed(() => {
    return props.projects.find(el => el.code === props.card.project)?.name
})

const emits = defineEmits<{
    (e: 'remove', value: Task) : void,
    (e: 'edit', value: Task) : void
}>()

</script>

<style scoped lang="scss" src="./scss/index.scss"/>
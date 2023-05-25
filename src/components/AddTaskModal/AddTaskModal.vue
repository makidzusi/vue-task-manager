<template>
    <Modal @close="emits('close')">
        <h3 class="add-modal__title">Основные данные</h3>
        <p class="add-modal__desc">Чтобы добавить карточку, нужно заполнить данные</p>
        <div class="add-modal__body">
            <Input label="Заголовок *:" v-model="taskData.title" />
            <div>
                <span class="add-modal__label">Проект:</span>
                <Select :is-white="true" v-model="taskData.project" :options="projectsOptions" />
            </div>
            <div v-if="!props.task">
                <span class="add-modal__label">Стадия*:</span>
                <Select :is-white="true" v-model="taskData.stage" :options="stageOptions"/>
            </div>
            <Input class="add-modal__score-input" label="Балл *:" type="number" v-model="taskData.score" />
        </div>
        <div class="add-modal__buttons">
            <Button @click="handleAdd">
                {{ props.task ? 'Редактировать' : 'Добавить' }}
            </Button>
            <span class="add-modal__back" @click="emits('close')">Назад</span>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Column, Project, Task } from '@/types';
import { useToast } from "vue-toastification";

const toast = useToast()
const emits = defineEmits<{
    (e: 'close') : void,
    (e: 'create-task', value: Task) : void
}>()

const props = defineProps<{
    projects: Project[],
    columns: Column[],
    task?: Task
}>()

onMounted(() => {
    if(props.task) {
        taskData.value = {...props.task}
    }
})

const projectsOptions = computed(() => {
    return props.projects.map(el => {
        return {
            value: el.code,
            label: el.name
        }
    })
})

const stageOptions = computed(() => {
    return props.columns.map(el => {
        return {
            value: el.code,
            label: el.name
        }
    })
})

const taskData = ref<Task>({
    title: "",
    score: 0,
    project: "",
    stage: "",
    id: Math.round(Math.random() * 10000)
})

const handleAdd = () => {
    if(!taskData.value.title || !taskData.value.stage) {
        toast.warning("Заполните все поля помеченные звездочкой")
        return
    }
    emits('create-task', taskData.value)
    emits('close')
}
</script>

<style scoped lang="scss" src="./scss/index.scss"/>
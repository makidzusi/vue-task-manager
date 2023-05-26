<script setup lang="ts">
import draggable from 'vuedraggable';
import { computed, onMounted, ref } from 'vue'
import Card from '@/components/Card'
import Button from '@/components/Button';
import AddTaskModal from '@/components/AddTaskModal';
import Select from '@/components/Select';
import IconBase from '@/components/IconBase';
import Loader from '@/components/Loader';
import { Column, Project, Task } from '@/types';
import {
    getColumnsListAsync,
    getProjectsListAsync,
    getTasksListAsync,
    saveDataToLocalStorage
}
    from '@/api';

import { useToast } from "vue-toastification";


interface extendedColumn extends Column {
    list: Task[]
}

const isAddTaskModalOpened = ref<boolean>(false)
const isEditingModalOpened = ref<boolean>(false)
const projects = ref<Project[]>([])
const stages = ref<Column[]>([])
const taskToEdit = ref<Task>()
const data = ref<extendedColumn[]>([])
const selectedProjectCode = ref('')
const toast = useToast()
const isLoading = ref(true)

onMounted(() => {
    const promises = []

    promises.push(getProjectsListAsync().then((res) => {
        projects.value = res
    }))

    promises.push(getColumnsListAsync().then(res => {
        stages.value = res
        data.value = res.map((el: any) => {
            el.list = []
            return el
        })
    }))

    promises.push(getTasksListAsync().then((res) => {
        res.forEach((task) => {
            const column = task.stage
            const stage = data.value.find(el => el.code === column)
            stage?.list.push(task)
        })
    }))

    Promise.all(promises).then(() => {
        isLoading.value = false
    })
})

const selectOtions = computed(() => {
    return projects.value.map(el => {
        return {
            value: el.code,
            label: el.name
        }
    })
})


const handleEnd = () => {
    data.value = data.value.map(el => {
        const stage = el.code
        el.list = el.list.map(el => {
            el.stage = stage
            return el
        })
        return el
    })
}

const sortByAsc = (stage: extendedColumn) => {
    stage.list = stage.list.sort((a, b) => b.score - a.score)
}

const sortByDsc = (stage: extendedColumn) => {
    stage.list = stage.list.sort((a, b) => a.score - b.score)
}

const handleRemove = (card: Task, stage: extendedColumn) => {
    stage.list = stage.list.filter((el) => el.id !== card.id)
}

const handleCreateTask = (task: Task) => {
    data.value.find(el => el.code === task.stage)?.list.push(task)
}

const isCardVisible = (card: Task) => {
    if (!selectedProjectCode.value) return true
    return card.project === selectedProjectCode.value
}

const saveChanges = () => {
    saveDataToLocalStorage(data.value)
    toast.success("Данные сохранены")
}

const handleEdit = (task: Task) => {
    taskToEdit.value = task
    isEditingModalOpened.value = true
}

const handleTaskEdit = (task: Task) => {
    const taskStageList = data.value.find(el => el.code === task.stage)
    taskStageList!.list = taskStageList!.list.map(el => {

        if (el.id === task.id) {
            el = { ...task }
        }
        return el
    })
}

const dragOptions = {
    animation: 200,
    group: "tasks",
    disabled: false,
    ghostClass: "dashboard__ghost"
};

</script>

<template>
    <Loader v-if="isLoading" />
    <div class="dashboard" v-else>
        <div>

            <div class="dashboard__header">
                <h1 class="dashboard__title">Карточки</h1>
                <div class="dashboard__controls">
                    <div class="dashboard__select">
                        <span>Проект:</span>
                        <Select v-model="selectedProjectCode" :options="selectOtions" />
                    </div>
                    <Button @click="isAddTaskModalOpened = true">
                        Добавить карточку
                    </Button>
                    <Button @click="saveChanges">
                        Сохранить изменения
                    </Button>
                </div>
            </div>



            <AddTaskModal v-if="isAddTaskModalOpened" @create-task="handleCreateTask" :projects="projects" :columns="stages"
                @close="isAddTaskModalOpened = false" />
            <AddTaskModal v-if="isEditingModalOpened" @create-task="handleTaskEdit" :task="taskToEdit" :projects="projects"
                :columns="stages" @close="isEditingModalOpened = false" />

        </div>

        <div class="dashboard__stages">
            <div class="dashboard__column" v-for="stage in data" :key="stage.id">
                <div class="dashboard__column-controls">
                    <h3 class="dashboard__column-title">{{ stage.name }}</h3>
                    <div>
                        <IconBase @click="sortByAsc(stage)" color="#38393D" class="dashboard__sort-btn" title="arrow-down"
                            :height="24" :width="24" />
                        <IconBase @click="sortByDsc(stage)" color="#38393D" class="dashboard__sort-btn" title="arrow-up"
                            :height="24" :width="24" />
                    </div>
                </div>
                <div>
                    <div class="dashboard__empty" v-if="!stage.list.length">
                        <span>Список пуст</span>
                        <draggable class="dashboard__dropzone" group="tasks" v-model="stage.list" item-key="id"
                            @end="handleEnd">
                            <template #item>
                                <span> </span>
                            </template>
                        </draggable>
                    </div>
                    <template v-else>
                        <draggable class="dashboard__column-items" @end="handleEnd" v-model="stage.list" item-key="id"
                            v-bind="dragOptions">
                            <template #item="{ element }">
                                <Card @edit="handleEdit" :projects="projects" v-if="isCardVisible(element)"
                                    @remove="handleRemove($event, stage)" :card="element" />
                            </template>
                        </draggable>
                        <button class="dashboard__column-add" @click="isAddTaskModalOpened = true">Добавить</button>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss" src="./scss/index.scss"/>
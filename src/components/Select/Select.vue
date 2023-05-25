<template>
    <div class="select" v-on-click-outside="close">
        <div class="select__head" ref="reference" @click="isOpened = !isOpened">
            <span class="select__title">{{ activeLabel }}</span>
            <IconBase title="chevron-down" :height="14" :width="14" class="select__chevron" />
        </div>
        <div class="select__body" v-if="isOpened" ref="floating" :style="{
            position: strategy,
            top: `${y ?? 0}px`,
            left: `${x ?? 0}px`,
            width: '',
        }">
            <div class="select__item" @click="handleSelect(null)">
                Не выбрано
            </div>
            <div @click="handleSelect(item)" class="select__item" v-for="item in props.options" :key="`opt-${item.label}`">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import IconBase from '@/components/IconBase';
import { vOnClickOutside } from '@vueuse/components'
import { useFloating, autoUpdate } from '@floating-ui/vue'
import { offset, shift, flip, size } from '@floating-ui/core'

const reference = ref(null)
const floating = ref(null)
const isOpened = ref(false)

const activeLabel = computed(() => {
    if (!props.modelValue) {
        return 'Не выбрано'
    }
    return props.options.find(el => el.value === props.modelValue)?.label
})

const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: any): void
}>()

type Option = {
    value: any,
    label: string
}

const props = withDefaults(defineProps<{
    options: Option[],
    modelValue: any,
    isWhite?: boolean
}>(), {
    isWhite: false
})

const { x, y, strategy } = useFloating(reference, floating, {
    middleware: [shift(), offset(10), flip(), size({
        apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`
            });
        }
    }),],
    whileElementsMounted: autoUpdate
})

const handleSelect = (item: Option | null) => {
    if(item === null) {
        emit('update:modelValue', null)
    } else {
        emit('update:modelValue', item.value)
    }
    isOpened.value = false
}

const close = () => {
    isOpened.value = false
}

const backgroundColor = computed(() => {
    if(props.isWhite) {
        return '#F0F3F8'
    }
    return '#D5DCE5'
})


</script>

<style scoped lang="scss">
.select {
    user-select: none;
    white-space: nowrap;

    &__head {
        background: v-bind(backgroundColor);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 13px;
        line-height: 16px;
    }

    &__title {
        margin-right: 12.76px;
    }

    &__item {
        color: var(--text-color);
        cursor: pointer;
        border-radius: 8px;
        text-align: center;
        box-shadow: var(--shadow);
        padding: 4px;
        margin: 0 5px;

        &:hover {
            opacity: 0.8;
        }

        &:not(:last-child) {
            margin-bottom: 4px;
        }
    }

    &__body {
        background: v-bind(backgroundColor);
        border-radius: 4px;
        width: 100%;
        z-index: 10;
        padding: 10px 0 10px 0;
        box-shadow: var(--shadow);
    }

    &__chevron {
        color: #D5DCE5;
    }
}</style>
<script setup lang="ts">
interface Props {
    value: number
}

const props = withDefaults(defineProps<Props>(), {
    value: 0,
})
</script>

<template>
    <div class="h-2 w-full bg-[#DAEFE5] rounded-[2px] overflow-hidden relative">
        <span 
            class="absolute start-0 top-0 h-full bg-[#1ab266] rounded-[2px]"
            :style="{width: props.value + '%'}"
        ></span>
    </div>
</template>
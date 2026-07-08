<template>
    <svg aria-hidden="true" :style="{ width: size + 'px', height: size + 'px' }">
        <use :xlink:href="symbolId" :fill="color" />
    </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    iconName: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: [Number, String],
        default: 18
    }
})
const symbolId = computed(() => `#icon-${props.iconName}`);

</script>


<style scoped>
/* 设置了图标的填充颜色为当前文本颜色，并使其在垂直方向上居中对齐 */
.svg-icon {
    fill: currentColor;
    vertical-align: middle;
}
</style>

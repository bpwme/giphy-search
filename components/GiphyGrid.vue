<script setup lang="ts">
defineProps<{
    gifs: Gif[]
}>()
</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 sm:gap-2 overflow-clip p-8 pt-0">
        <div v-for="(gif, gifKey) in gifs" :key="gifKey" class="aspect-square bg-amber-900">
            <NuxtImg :src="gif.url" alt="GIF" class="w-full h-full object-cover" loading="lazy" placeholder />
        </div>
    </div>
</template>

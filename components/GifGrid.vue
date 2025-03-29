<script setup lang="ts">
const searchQuery = ref('test')
const { debouncedValue: debouncedQuery } = useDebouncedValue(searchQuery)

const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    error
} = useGiphy(debouncedQuery)
</script>

<template>
    <div>
        <input v-model="searchQuery" placeholder="Search GIFs..." class="border p-2">
        <button v-if="hasNextPage" @click="() => fetchNextPage()">Fetch next</button>
        {{ data }}
    </div>
</template>
<script setup lang="ts">

const searchQuery = ref('test')
const showSuggestions = ref(false)

const { searchResults, searchSuggestions } = useGiphy(searchQuery)

const {
    data: resultsData,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
    isLoading,
    error
} = searchResults

const {
    data: suggestionsData
} = searchSuggestions

// TODO toggle list on input focus
const toggleSuggestions = () => {

}

const suggestionClick = (value: string) => {
    searchQuery.value = value
}
const searchClick = () => {
    refetch()
}
</script>

<template>
    <div>
        <input v-model="searchQuery" placeholder="Search GIFs..." class="border p-2">
        <button class="border p-2" @click="searchClick">Search</button>
        <button v-if="hasNextPage" class="border p-2" @click="() => fetchNextPage()">Fetch next</button>
        <div v-for="(suggestion, suggestionKey) in suggestionsData" :key="suggestionKey"
            @click="() => suggestionClick(suggestion)">
            {{ suggestion }}
        </div>
        <div>
            {{ resultsData }}
        </div>
    </div>
</template>
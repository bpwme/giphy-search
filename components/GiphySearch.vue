<script setup lang="ts">
const searchQuery = ref('')
const scrollRef = ref<HTMLElement | null>(null)

const {
    searchResults,
    searchSuggestions,
    fetchNextPage,
    hasNextPage,
    isFetching
} = useGiphyApi(searchQuery)

const { data: searchResultsData, refetch: fetchSearchResults } = searchResults
const suggestionsData = searchSuggestions.data

const gifs = computed<Gif[]>(() => {
    return (searchResultsData.value?.pages.flatMap((page) => page?.data) ?? []) as Gif[]
})
const { sortedGifs, selectedRatings, sortOrder } = useGifFilters(gifs);

const disableFetch = computed(() => !hasNextPage.value || isFetching.value)

useInfiniteScroll(scrollRef, fetchNextPage, disableFetch)
</script>

<template>
    <div>
        <div class="relative p-8">
            <SearchBar v-model="searchQuery" :suggestions="suggestionsData" :sort-order="sortOrder"
                :selected-ratings="selectedRatings" @update:sort-order="sortOrder = $event"
                @update:selected-ratings="selectedRatings = $event" @search="fetchSearchResults" />

        </div>

        <div v-if="gifs.length > 0">
            <GiphyGrid :gifs="sortedGifs" />

            <div ref="scrollRef" class="h-24 w-full flex items-center justify-center border-t border-gray-700 mt-4">
                <div v-if="isFetching" class="text-gray-500 flex items-center">
                    Loading more...
                </div>
                <div v-else-if="!hasNextPage" class="text-gray-500">
                    No more results
                </div>
                <div v-else class="text-gray-500">
                    Scroll for more
                </div>
            </div>
        </div>
        <div v-else-if="isFetching" class="h-20 w-full text-center text-gray-500">
            Loading results...
        </div>
        <div v-else-if="searchResultsData" class="h-20 w-full text-center text-gray-500">
            No results found
        </div>

        <!-- Debug fetchNextPage button -->
        <!-- <div class="fixed bottom-4 right-4">
            <button v-if="hasNextPage && !isFetching" class="bg-blue-500 text-white px-4 py-2 rounded"
                @click="fetchNextPage()">
                Load More
            </button>
        </div> -->
    </div>
</template>
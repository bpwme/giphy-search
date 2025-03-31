<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
    suggestions?: string[] | null;
    sortOrder: SortOrder;
    selectedRatings: GifRating[];
}>();

const emit = defineEmits([
    "update:modelValue",
    "update:sortOrder",
    "update:selectedRatings",
    "search"
]);

const searchQuery = ref(props.modelValue);
const showSuggestions = ref(false);

watch(() => props.modelValue, (newVal) => {
    searchQuery.value = newVal;
});

const updateQuery = (value: string) => {
    emit("update:modelValue", value);
};

const suggestionClick = (value: string) => {
    emit("update:modelValue", value);
    showSuggestions.value = false;
};

const setSuggestionsVisibility = (isVisible: boolean) => {
    showSuggestions.value = isVisible;
};

const toggleRating = (event: Event, rating: GifRating) => {
    const target = event.target as HTMLInputElement;
    const updatedRatings = target.checked
        ? [...(props.selectedRatings || []), rating]
        : (props.selectedRatings || []).filter(r => r !== rating);

    emit('update:selectedRatings', updatedRatings);
};
</script>

<template>
    <div class="w-md flex flex-row justify-between">
        <div class="flex-1 shrink">
            <div class="flex w-full relative z-0">
                <input v-model="searchQuery" placeholder="Search GIFs..."
                    class="border bg-slate-600 rounded-md p-2 h-10 flex-1 focus:outline-0"
                    :class="{ 'border-b-0 rounded-b-none': showSuggestions }" @input="updateQuery(searchQuery)"
                    @focus="setSuggestionsVisibility(true)" @blur="setSuggestionsVisibility(false)">

                <div v-if="showSuggestions" class="absolute top-10 right-0 left-0 flex flex-col z-0">
                    <div v-if="suggestions && suggestions.length > 0">
                        <div v-for="(suggestion, key) in suggestions" :key="key"
                            class="border-x border-t bg-slate-700 last:border-b p-2 last:rounded-b-md hover:cursor-pointer hover:bg-slate-600"
                            @mousedown="suggestionClick(suggestion)">
                            {{ suggestion }}
                        </div>
                    </div>
                    <div v-else
                        class="border-x border-t bg-slate-700 last:border-b p-2 text-zinc-400 border-zinc-50 last:rounded-b-md hover:cursor-pointer hover:bg-slate-600">
                        {{ searchQuery.length < 3 ? "Type at least 3 letters for suggestions..."
                            : "No suggestions found" }} </div>
                    </div>
                </div>
            </div>

            <div
                class="*:ml-4 *:border *:p-2 *:h-10 *:rounded-md *:bg-cyan-700 *:cursor-pointer *:hover:bg-cyan-600 flex">
                <button :disabled="searchQuery.length === 0" @click="emit('search')">Search</button>

                <select :value="props.sortOrder" class="p-2 border rounded"
                    @change="emit('update:sortOrder', ($event.target as HTMLSelectElement).value)">
                    <option selected value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <div class="flex gap-2 text-nowrap">
                    Rating:
                    <label v-for="(rating, ratingKey) in ['y', 'g', 'pg', 'pg-13', 'r']" :key="ratingKey">
                        <input type="checkbox" :checked="props.selectedRatings?.includes(rating as GifRating)"
                            @change="(event) => toggleRating(event, rating as GifRating)">
                        {{ rating }}
                    </label>
                </div>
            </div>
        </div>
</template>

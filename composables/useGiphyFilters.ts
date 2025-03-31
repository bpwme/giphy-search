export type SortOrder = "asc" | "desc";

export const useGifFilters = (gifs: Ref<Gif[]>) => {
  const selectedRatings = ref<GifRating[]>([]);
  const sortOrder = ref<SortOrder>("desc");

  const filteredGifs = computed(() => {
    if (selectedRatings.value.length === 0) {
        return gifs.value
    }
    return gifs.value.filter((gif) => selectedRatings.value.includes(gif.rating));
  });

  const sortedGifs = computed(() => {
    return [...filteredGifs.value].sort((a, b) => {
      const dateA = a.createdAt.getTime()
      const dateB = b.createdAt.getTime();
      return sortOrder.value === "asc" ? dateA - dateB : dateB - dateA;
    });
  });
  
  return {
    sortedGifs,
    selectedRatings,
    sortOrder
  };
};

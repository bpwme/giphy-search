import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";

export type GifRating = 'y' | 'g' | 'pg' | 'pg-13' | 'r'

export interface Gif {
    id: string,
    title: string,
    url: string,
    rating: GifRating
    createdAt: Date
}

export interface UseGifResponse {
    data: Gif[],
    nextPageOffset: number
}

interface GiphySearchResponse {
    data: {
        id: string,
        title: string,
        rating: GifRating,
        import_datetime: string
        images: {
            original: {
                url: string
            }
        }
    }[],
    meta: { msg: string },
    pagination: { count: number, offset: number, total_count: number }
}

interface GiphySuggestionsResponse {
    data: {
        name: string
    }[]
    meta: { msg: string },
}

export const useGiphyApi = (query: Ref<string>) => {
    const API_KEY = useRuntimeConfig().public.giphyApiKey;
    const API_URL = 'https://api.giphy.com/v1/gifs';
    const CACHE_TTL = 1000 * 60 * 5;

    const { debouncedValue: debouncedQuery } = useDebouncedValue(query);

    const searchResults = useInfiniteQuery({
        queryKey: ['giphy-search-results', debouncedQuery],
        queryFn: async ({ pageParam }): Promise<UseGifResponse | null> => {
            if (!debouncedQuery.value) {
                return null
            };

            const res = await $fetch<GiphySearchResponse>(`${API_URL}/search`, {
                params: {
                    api_key: API_KEY,
                    q: debouncedQuery.value.trim(),
                    limit: 8,
                    offset: pageParam
                }
            });

            if (!res.data || res.meta.msg !== 'OK') {
                throw new Error('Failed to fetch GIFs');
            }

            return {
                data: res.data.map(gif => ({
                    id: gif.id,
                    title: gif.title,
                    url: gif.images.original.url,
                    rating: gif.rating,
                    createdAt: new Date(gif.import_datetime.replace(" ", "T")) // Convert to ISO format
                })),
                nextPageOffset: res.pagination.offset + res.pagination.count 
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage?.nextPageOffset,
        staleTime: CACHE_TTL,
        retry: 2,
        enabled: false
    });

    const searchSuggestions = useQuery({
        queryKey: ['giphy-search-suggestions', debouncedQuery],
        queryFn: async (): Promise<string[] | null> => {
            if (!debouncedQuery.value || debouncedQuery.value.length < 3) {
                return null
            }

            const res = await $fetch<GiphySuggestionsResponse>(`${API_URL}/search/tags`, {
                params: { api_key: API_KEY, q: debouncedQuery.value }
            });

            if (!res.data || res.meta.msg !== 'OK') {
                throw new Error('Failed to fetch suggestions')
            }

            return res.data.map(item => item.name);
        },
        staleTime: CACHE_TTL,
        retry: 2,
    });

    return {
        searchResults,
        searchSuggestions,
        fetchNextPage: searchResults.fetchNextPage,
        hasNextPage: searchResults.hasNextPage,
        isFetching: searchResults.isFetching
    };
};

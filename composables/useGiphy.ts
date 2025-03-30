import { useQuery, useInfiniteQuery } from "@tanstack/vue-query";


interface Gif {
    id: string,
    title: string,
    url: string
}

export interface UseGifResponse {
    data: Gif[],
    nextPageOffset: number
}

interface GiphySearchResponse {
    data: {
        id: string,
        title: string,
        images: {
            // Only using `original` here for brevity
            original: {
                url : string
            }
        }
    }[],
    meta: {
        msg: string
    },
    pagination: {
        count: number,
        offset: number,
        total_count: number
    }
}

export const useGiphy = (query: Ref<string>) => {
    const API_KEY = useRuntimeConfig().public.giphyApiKey
    const API_URL = 'https://api.giphy.com/v1/gifs' // TODO .env
    const CACHE_TTL = 1000 * 60 * 5

    const { debouncedValue: debouncedQuery } = useDebouncedValue(query)

    const searchResults =  useInfiniteQuery({
        queryKey: ['giphy-search-results'],
        queryFn: async ({pageParam}): Promise<UseGifResponse | null> => {
            if (!query) {
                return null
            }

            
            const res = await $fetch<GiphySearchResponse>(`${API_URL}/search`, {
                params : {
                    api_key: API_KEY,
                    q: query.value,
                    offset: pageParam
                }
            })

            if (!res.data || res.meta.msg !== 'OK') {
                throw new Error('Failed to fetch GIFs')
            }

            return {
                data: res.data.map((gif) => ({
                    id: gif.id,
                    title: gif.title,
                    url: gif.images.original.url
                })),
                nextPageOffset: Math.min(res.pagination.offset + res.pagination.count, res.pagination.total_count)
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage?.nextPageOffset,
        staleTime: CACHE_TTL,
        retry: 2,
        enabled: false
    })

    // TODO types
    const searchSuggestions = useQuery({
        queryKey: ['giphy-search-suggestions', debouncedQuery],
        queryFn: async (): Promise<unknown | null> => {
            if (!debouncedQuery.value || debouncedQuery.value.length < 3) {
                return null
            }

            const res = await $fetch<unknown>(`${API_URL}/search/tags`, {
                params : {
                    api_key: API_KEY,
                    q: debouncedQuery.value,
                }
            })

            if (!res.data || res.meta.msg !== 'OK') {
                throw new Error('Failed to fetch GIFs')
            }

            return res.data.map(item => item.name)
        },
        staleTime: CACHE_TTL,
        retry: 2,

    })

    return {
        searchResults,
        searchSuggestions
    }
    // return searchResults
}
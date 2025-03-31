export const useInfiniteScroll = (
  elementRef: Ref<HTMLElement | null>,
  callback: () => void,
  disableCallback?: Ref<boolean>
) => {
  let observer: IntersectionObserver | null = null

  const createObserver = () => {
    if (!elementRef.value) {
        return
    }
    
    observer?.disconnect()
    
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !disableCallback?.value) {
          callback()
        }
      },{ 
        root: null,
        rootMargin: '0px 0px 20px 0px',
        threshold: 0
      }
    )
    
    observer.observe(elementRef.value)
  }

  onMounted(() => {
    createObserver()
    
    watch(elementRef, () => {
      createObserver()
    })
    
    onUnmounted(() => {
      observer?.disconnect()
    })
  })
}

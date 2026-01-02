<script lang="ts">
  import styles from './Carousel.module.css';
  import Arrow from '$lib/icons/arrow.svelte';
  import ReviewComponent from '$lib/components/ReviewComponent.svelte';
  import type { ReviewComplete } from '$lib/definitions';
  import { onMount } from 'svelte';
  interface Props {
    items: ReviewComplete[];
  }

  let { items }: Props = $props();

  let isMobile = false;

  onMount(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    isMobile = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      isMobile = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });

  const slideShift = $derived(isMobile ? 14.28 : 11.11);
  let transformValue = $state(0);
  let direction = $state(0);
  let isTransitioning = $state(false);
  let orderMap = $state(new Array(items.length).fill(0).map((_, i) => i + 1));

  function next() {
    if (isTransitioning) return;
    isTransitioning = true;
    direction = 1;
    transformValue = slideShift;
  }

  function prev() {
    if (isTransitioning) return;
    isTransitioning = true;
    direction = -1;
    transformValue = -slideShift;
  }

  const handleTransitionEnd = () => {
    // Reorder items
    const newOrder = [...orderMap];
    if (direction === 1) {
      newOrder.push(newOrder.shift()!);
    } else if (direction === -1) {
      newOrder.unshift(newOrder.pop()!);
    }
    orderMap = newOrder;

    // Reset transform to 0 (items are now reordered)
    transformValue = 0;
    direction = 0;
    isTransitioning = false;
  };
</script>

<div>
  <div class="relative mx-auto my-0 max-w-96 pt-16 pb-9 md:max-w-[78rem]">
    <h1 class="inline-block text-left text-4xl font-bold md:text-5xl">Our happy customers</h1>
    <div class={`${styles.arrows} inline-block`}>
      <button onclick={prev}>
        <Arrow class="inline-block rotate-180 fill-black" height={24} width={24} />
      </button>
      <button onclick={next}>
        <Arrow class="inline-block fill-black" height={24} width={24} />
      </button>
    </div>
  </div>
  <div
    class="relative mx-auto my-0 max-w-96 py-5 before:absolute before:top-0 before:-left-full before:z-10 before:h-full before:w-full before:backdrop-blur-sm after:absolute after:top-0 after:-right-full after:z-10 after:h-full after:w-full after:backdrop-blur-sm md:max-w-[78rem]"
  >
    <div class="w-[700%] -translate-x-[28.57%] md:w-[300%] md:-translate-x-[22.22%]">
      <div
        class="flex flex-row flex-nowrap items-stretch justify-start gap-5"
        style="transition: {isTransitioning
          ? 'transform 0.5s ease-in-out'
          : 'none'}; transform: translateX({transformValue}%);"
        ontransitionend={handleTransitionEnd}
      >
        {#each items as item, i (item.id)}
          <div class="w-1/3 md:w-[calc(11.11%-1rem)]" style="order: {orderMap[i]};">
            <ReviewComponent {...item} />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<script lang="ts">
  import styles from './search_result_header.module.css';
  import FiltersIcon from '$lib/icons/filters.svelte';

  interface Props {
    indexFirst: number;
    indexLast: number;
    totalCount: number;
    onFiltersClick?: () => void;
  }

  let { indexFirst, indexLast, totalCount, onFiltersClick }: Props = $props();

  const handleFiltersClick = onFiltersClick ?? (() => {});
</script>

<div class="flex flex-row items-center justify-between">
  <h1 class="text-xl md:text-4xl">Casual</h1>
  <span class="text-sm text-[rgba(0,0,0,.6)]">
    <span class="mr-3">Showing {indexFirst}-{indexLast} of {totalCount} Products</span>
    <form class="hidden md:inline-block">
      <span>Sort by: </span>
      <select
        class={`${styles.sort_by} appearance-none pr-5 text-black`}
        name="sort_by"
        id="sort_by"
      >
        <option value="1">Most Popular</option>
        <option value="2">Latest</option>
        <option value="3">Oldest</option>
        <option value="4">Cheapest</option>
      </select>
    </form>
    <button class="inline-block md:hidden" onclick={handleFiltersClick}>
      <FiltersIcon class="fill-black opacity-60" width={24} height={24} />
    </button>
  </span>
</div>

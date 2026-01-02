<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Product } from '$lib/definitions';
  import Item from '$lib/components/Item.svelte';

  interface Props {
    title: string;
    items: Product[];
  }

  let { title, items }: Props = $props();
</script>

<div class="mx-auto my-0 max-w-96 pb-16 md:max-w-[78rem]">
  <h1 class="pt-16 pb-14 text-center text-5xl font-bold">{title}</h1>
  <div class="grid grid-cols-2 gap-x-5 md:grid-cols-4">
    {#each items as item, i (item.id)}
      <div class={i > 1 ? 'hidden md:block' : 'block'}>
        <Item {...item} />
      </div>
    {/each}
  </div>
  <div class="mt-10 text-center">
    <a
      href={resolve('/search')}
      class="w-full rounded-full border border-black px-20 py-4 md:w-auto">View All</a
    >
  </div>
</div>

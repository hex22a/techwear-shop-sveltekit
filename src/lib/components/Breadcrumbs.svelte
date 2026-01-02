<script lang="ts">
  import { resolve } from '$app/paths';
  import SlimArrow from '$lib/icons/slim-arrow.svelte';

  interface Props {
    sitePath: { name: string; url: string }[];
  }

  let { sitePath }: Props = $props();
</script>

{#each sitePath as path, index (path.name)}
  <span class={index < sitePath.length - 1 ? `mr-3 opacity-60` : 'opacity-100'}>
    <a href={resolve(path.url)} class="mr-1">{path.name}</a>
    {#if index < sitePath.length - 1}
      <SlimArrow class="mb-1 inline-block -rotate-90 fill-black" width={16} height={16} />
    {/if}
  </span>
{/each}

<script lang="ts">
  import Stars from '$lib/components/Stars.svelte';

  interface Props {
    rating: number;
    title: string;
    review_text: string;
    verified?: boolean;
  }

  let { rating, title, review_text, verified }: Props = $props();
</script>

<div class="h-full rounded-xl border border-gray-500 px-8 py-7">
  <div class="mb-5">
    <Stars {rating} />
  </div>
  <article class="mb-3 leading-6">
    <h3 class="mr-1 inline-block align-middle">{title}</h3>
    {#if verified}
      <img
        class="inline-block align-middle"
        src="/vector/verified.svg"
        alt="verified checkmark"
        width={24}
        height={24}
      />
    {/if}
  </article>
  <p class="text-wrap">{review_text}</p>
</div>

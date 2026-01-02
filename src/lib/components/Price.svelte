<script lang="ts">
  interface Props {
    price: number;
    discount?: {
      newPrice: number;
      percent: number;
    };
  }

  let { price, discount }: Props = $props();
</script>

{#if discount}
  <span class="mr-1 font-bold md:mr-3">${discount.newPrice}</span>
  <span class="mr-1 line-through md:mr-3">${price}</span>
  <span class="rounded-full bg-red-100 px-3.5 py-1.5 text-red-600">{discount.percent}%</span>
{:else}
  <span class="font-bold">${price}</span>
{/if}

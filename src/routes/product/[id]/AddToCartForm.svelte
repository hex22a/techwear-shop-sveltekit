<script lang="ts">
  import type { ActionData } from './$types';
  import colors_style from '$lib/components/colors.module.css';
  import Quantity from './Quantity.svelte';
  import type { Color, Size } from '$lib/definitions';

  interface Props {
    product_id: number;
    colors: Color[];
    sizes: Size[];
    form?: ActionData;
  }

  let { product_id, colors, sizes, form }: Props = $props();
</script>

<form method="POST" action="?/addToCart">
  <fieldset>
    <input type="hidden" name="product_id" value={product_id} />
    <legend class="mb-4">Select Colors</legend>
    <div class="flex flex-row items-center justify-start gap-3 md:gap-4">
      {#each colors as color (color)}
        <label for={`color-${color.hex_value}`}>
          <input
            class="peer hidden"
            type="radio"
            name="color_id"
            id={`color-${color.hex_value}`}
            value={color.id}
            aria-checked={true}
          />
          <div
            class={`${colors_style.radio_mark_check} relative inline-block h-9 w-9 rounded-full`}
            style="backgroundColor: #{color.hex_value}"
            tabIndex={0}
          ></div>
        </label>
      {/each}
    </div>
    <div class="text-sm text-red-500 md:text-base">
      {#if form?.errors?.color_id}
        {#each form.errors.color_id as error (error)}
          <p>{error}</p>
        {/each}
      {/if}
    </div>
  </fieldset>
  <hr class="my-6" />
  <fieldset>
    <legend class="mb-4">Choose size</legend>
    <div class="flex flex-row justify-between gap-2 text-sm md:justify-start md:gap-3 md:text-base">
      {#each sizes as size (size)}
        <label for={`size-${size.value}`}>
          <input
            class="peer hidden"
            type="radio"
            name="size_id"
            id={`size-${size.value}`}
            value={size.id}
            aria-checked={true}
          />
          <div
            class="relative inline-block rounded-full bg-gray-300 px-5 py-2.5 opacity-60 peer-checked:bg-black peer-checked:text-white peer-checked:opacity-100 md:px-6 md:py-3"
            tabIndex={0}
          >
            {size.size}
          </div>
        </label>
      {/each}
    </div>
    <div class="text-sm text-red-500 md:text-base">
      {#if form?.errors?.size_id}
        {#each form.errors.size_id as error (error)}
          <p>{error}</p>
        {/each}
      {/if}
    </div>
  </fieldset>
  <hr class="my-6" />
  <div
    class="flex w-full flex-row items-stretch justify-between gap-3 text-sm md:gap-5 md:text-base"
  >
    <span class="w-44 rounded-full bg-gray-200 px-3 py-3 md:py-3.5">
      <Quantity name="quantity" initialQuantity={1} />
    </span>
    <button class="w-full rounded-full bg-black py-3 text-white md:py-3.5" type="submit">
      Add to Cart
    </button>
  </div>
  {#if form?.message}
    <div class="text-sm text-red-500 md:text-base">
      {form?.message}
    </div>
  {/if}
</form>

<script lang="ts">
  import styles from './order_form.module.css';
  import TrashBinIcon from '$lib/icons/trash-bin.svelte';
  import ArrowIcon from '$lib/icons/arrow.svelte';
  import Quantity from '../product/[id]/Quantity.svelte';
  import type { ActionData } from './$types';
  import type { CartProduct } from '$lib/definitions';

  interface OrderFormProps {
    products: CartProduct[];
    summary: {
      subtotal: number;
      discount: number;
      deliveryFee: number;
      total: number;
    };
    form?: ActionData;
  }

  let { products, summary, form }: OrderFormProps = $props();
  let { subtotal, discount, deliveryFee, total } = summary;
  let localProducts = $state(products);

  const deleteProduct = (id: number) => {
    localProducts = localProducts.filter((product) => product.id !== id);
  };
</script>

<form
  method="POST"
  action="/?orderProducts"
  class="grid grid-rows-[auto_auto] gap-5 md:grid-cols-12"
>
  <div class="rounded-xl border p-3.5 md:col-start-1 md:col-end-8 md:px-6 md:py-5">
    {#each localProducts as product, index (product.id + product.size + product.color_hex_value + product.quantity)}
      <div>
        {#if index !== 0}
          <hr class="my-6" />
        {/if}
        <input type="hidden" name={`products[${index}][product_id]`} value={product.id} />
        <div class="flex flex-row items-stretch justify-between">
          <div class="flex flex-row items-stretch justify-start gap-3.5">
            <div
              class="relative w-full overflow-hidden rounded-xl bg-gray-300 md:h-[124px] md:w-[124px]"
            >
              <img
                class="object-cover"
                src={product.photo_url}
                alt={`${product.name} cart photo`}
              />
            </div>
            <div class="flex flex-col justify-between">
              <div>
                <h2>{product.name}</h2>
                <div>
                  <span>Size: </span>
                  <span class="text-[rgba(0,0,0,.6)]">{product.size}</span>
                </div>
                <div>
                  <span>Color: </span>
                  <span class="text-[rgba(0,0,0,.6)]">{product.color_human_readable_value}</span>
                </div>
              </div>
              <div class="text-lg font-bold">
                ${product.price}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end justify-between">
            <button onclick={() => deleteProduct(product.id)}>
              <TrashBinIcon />
            </button>
            <div class="w-32 rounded-full bg-gray-200 px-3 py-2 md:py-2.5">
              <Quantity name={`products[${index}][quantity]`} initialQuantity={product.quantity} />
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="self-start rounded-xl border p-3.5 md:col-start-8 md:col-end-13 md:px-6 md:py-5">
    <h2 class="mb-6">Order Summary</h2>
    <div class="mb-5 flex flex-row items-center justify-between text-xl">
      <div class="text-[rgba(0,0,0,.6)]">Subtotal:</div>
      <div>${subtotal}</div>
    </div>
    <div class="mb-5 flex flex-row items-center justify-between text-xl">
      <div class="text-[rgba(1,0,0,.6)]">Discount: (-20%)</div>
      <div>-${discount}</div>
    </div>
    <div class="flex flex-row items-center justify-between text-xl">
      <div class="text-[rgba(0,0,0,.6)]">Delivery Fee</div>
      <div>${deliveryFee}</div>
    </div>
    <hr class="my-6" />
    <div class="flex flex-row items-center justify-between text-xl">
      <div>Total:</div>
      <div class="text-2xl font-bold">${total}</div>
    </div>
    <div class="relative my-6 w-full">
      <label class={styles.discount} for="discount"></label>
      <div class="flex flex-row items-center justify-between gap-3">
        <input
          id="discount"
          type="text"
          class="w-full rounded-full bg-[rgba(240,240,240,1)] py-3 pl-14 text-black"
          placeholder="Add promo code"
        />
        <button type="button" class="rounded-full bg-black px-9 py-3 text-white">Apply</button>
      </div>
    </div>
    <input type="hidden" name="total" value={total} />
    <button class="w-full rounded-full bg-black py-4 text-white"
      >Go to Checkout <ArrowIcon
        class="ml-1 inline-block fill-white"
        width={24}
        height={24}
      /></button
    >
  </div>
  {#if form}
    <div class="text-red-500">{form.message}</div>
  {/if}
</form>

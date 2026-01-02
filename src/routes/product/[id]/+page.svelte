<script lang="ts">
  import type { PageData } from './$types';

  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import Featured from '$lib/components/Featured.svelte';
  import Stars from '$lib/components/Stars.svelte';
  import Price from '$lib/components/Price.svelte';
  import Tabs from './Tabs.svelte';
  import type { Color, Size } from '$lib/definitions';
  import AddToCartForm from './AddToCartForm.svelte';

  const sitePath = [
    {
      name: 'Home',
      url: '/'
    },
    {
      name: 'Shop',
      url: '#'
    },
    {
      name: 'Wemen',
      url: '#'
    },
    {
      name: 'Jackets',
      url: '#'
    }
  ];

  export let data: PageData;

  const photos_array = Array.from(data.product.photos.entries());
  const sizesArray: Size[] = Array.from(data.product.sizes.entries()).map(([, value]) => ({
    ...value
  }));
  const colorsArray: Color[] = Array.from(data.product.colors.entries()).map(([, value]) => ({
    ...value
  }));
</script>

<div class="mx-auto mt-0 mb-20 w-96 md:w-[78rem]">
  <div class="py-6">
    <Breadcrumbs {sitePath} />
  </div>
  <main class="grid grid-cols-1 md:grid-cols-2 md:gap-x-5">
    <div class="flex flex-col items-center justify-between gap-3.5 md:flex-row-reverse">
      <div
        class="relative h-[290px] w-full overflow-hidden rounded-xl bg-gray-300 md:h-full md:w-[530px]"
      >
        {#if data.product.photo_url}
          <img
            class="object-cover"
            src={data.product.photo_url}
            alt={`${data.product.name} photo`}
          />
        {/if}
      </div>
      <div class="flex flex-row items-stretch justify-between gap-3.5 md:flex-col">
        {#each photos_array as [index, photo] (photo.id)}
          <div
            class="relative min-h-36 min-w-28 overflow-hidden rounded-xl bg-gray-300 md:h-[167px] md:w-[152px]"
          >
            <img
              class="object-cover"
              src={photo.url}
              alt={`${data.product.name} alt photo ${index}`}
            />
          </div>
        {/each}
      </div>
    </div>
    <div>
      <h1 class="text-4xl">{data.product.name}</h1>
      <div>
        <Stars rating={data.product.average_rating} />
      </div>
      <div>
        <Price price={data.product.price} discount={data.product.discount} />
      </div>
      <p>{data.product.description}</p>
      <hr class="my-6" />
      <AddToCartForm product_id={data.product.id} sizes={sizesArray} colors={colorsArray} />
    </div>
  </main>
  <Tabs
    defaultTab={0}
    product_id={data.product.id}
    reviews={data.product.reviews}
    details={data.product.details}
  />
  <Featured title="You might also like" items={[]} />
</div>

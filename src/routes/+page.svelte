<script lang="ts">
  import type { PageData } from './$types';

  import { resolve } from '$app/paths';

  import Brands from '$lib/components/Brands.svelte';
  import Featured from '$lib/components/Featured.svelte';
  import Carousel from '$lib/components/Carousel.svelte';

  export let data: PageData;
</script>

<main>
  <div class="bg-[rgba(240,240,240,1)]">
    <div class="mx-auto my-0 block max-w-96 md:grid md:max-w-[78rem] md:grid-cols-2">
      <div class="flex flex-col items-start justify-center">
        <h1 class="mb-8 text-4xl font-bold md:text-6xl">FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
        <p class="mb-8 text-sm md:text-base">
          Browse through our diverse range of meticulously crafted garments, designed to bring out
          your individuality and cater to your sense of style.
        </p>
        <a
          href={resolve('/search/')}
          class="mb-12 w-full rounded-full bg-black px-16 py-4 text-white md:w-auto"
        >
          Shop Now
        </a>
        <div class="flex flex-row flex-wrap items-stretch justify-center">
          <div class="inline-block border-r pr-4">
            <h2 class="text-3xl md:text-4xl">200+</h2>
            <p class="text-sm opacity-60 md:text-base">International Brands</p>
          </div>
          <div class="inline-block px-4 md:border-r">
            <h2 class="text-3xl md:text-4xl">2,000+</h2>
            <p class="text-sm opacity-60 md:text-base">High-Quality Products</p>
          </div>
          <div class="inline-block md:pl-4">
            <h2 class="text-3xl md:text-4xl">30,000+</h2>
            <p class="text-sm opacity-60 md:text-base">Happy Customers</p>
          </div>
        </div>
      </div>
      <div>
        <img src="/images/woman.webp" alt="woman in clothes" width={1280} height={1280} />
      </div>
    </div>
  </div>
  <Brands />
  <Featured title="New Arrivals" items={data.newArrivals} />
  <hr class="mx-auto my-0 max-w-96 md:max-w-[78rem]" />
  <Featured title="Top Selling" items={data.topSelling} />
  <div
    class="mx-auto my-0 max-w-96 rounded-3xl bg-gray-100 px-6 pb-7 md:max-w-[78rem] md:px-16 md:pb-20"
  >
    <h1 class="pt-16 pb-14 text-center text-5xl font-bold">Browse by dress style</h1>
    <div
      class="flex flex-col items-stretch justify-center gap-5 md:flex-row md:flex-wrap md:items-center"
    >
      <div
        class="relative h-48 overflow-hidden rounded-3xl bg-white md:h-72 md:flex-grow-0 md:basis-[calc(33.33%-10px)]"
      >
        <div class="absolute top-6 left-9 z-10 text-3xl font-bold">Casual</div>
        <img class="object-cover" src="/images/dress-style/casual.webp" alt="casual" />
      </div>
      <div
        class="relative h-48 overflow-hidden rounded-3xl bg-white md:h-72 md:flex-grow-1 md:basis-[calc(66.66%-10px)]"
      >
        <div class="absolute top-6 left-9 z-10 text-3xl font-bold">Formal</div>
        <img class="object-cover" src="/images/dress-style/formal.webp" alt="formal" />
      </div>
      <div
        class="relative h-48 overflow-hidden rounded-3xl bg-white md:h-72 md:flex-grow-1 md:basis-[calc(66.66%-10px)]"
      >
        <div class="absolute top-6 left-9 z-10 text-3xl font-bold">Outdoor</div>
        <img class="object-cover" src="/images/dress-style/outdoor.webp" alt="outdoor" />
      </div>
      <div
        class="relative h-48 overflow-hidden rounded-3xl bg-white md:h-72 md:flex-grow-0 md:basis-[calc(33.33%-10px)]"
      >
        <div class="absolute top-6 left-9 z-10 text-3xl font-bold">Party</div>
        <img class="object-cover" src="/images/dress-style/party.jpg" alt="party" />
      </div>
    </div>
  </div>
  <div class="mb-20">
    <Carousel items={data.reviews} />
  </div>
</main>

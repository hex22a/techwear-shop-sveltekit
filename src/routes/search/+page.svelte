<script lang="ts">
  import type { PageData } from './$types';

  import Arrow from '$lib/icons/arrow.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import Item from '$lib/components/Item.svelte';

  import SearchResultsHeader from './SearchResutlsHeader.svelte';
  import Filters from './Filters.svelte';
  import type { Product } from '$lib/definitions';

  const sitePath = [
    {
      name: 'Home',
      url: '/'
    },
    {
      name: 'Casual',
      url: '#'
    }
  ];

  const searchResultsHeaderProps = {
    indexFirst: 1,
    indexLast: 10,
    totalCount: 100
  };

  const items: Product[] = [
    {
      id: 1,
      name: 'Napapijri Anorak',
      average_rating: 5,
      price: 1000,
      photo_url: '/items/napa-anor.webp',
      discount: {
        newPrice: 800,
        percent: 20
      }
    },
    {
      id: 2,
      name: 'Riot Division Pants',
      average_rating: 4.8,
      price: 500,
      photo_url: '/items/riot-pants.webp'
    },
    {
      id: 3,
      name: 'MA.STRUM Jacket',
      average_rating: 3.9,
      price: 600,
      photo_url: '/items/mastrum-jacket.jpg'
    },
    {
      id: 4,
      name: 'MA.STRUM Jacket',
      average_rating: 4.5,
      price: 2000,
      photo_url: '/items/mastrum.jpg'
    },
    {
      id: 5,
      name: 'Napapijri Anorak',
      average_rating: 5,
      price: 2000,
      photo_url: '/items/napa-anor.webp',
      discount: {
        newPrice: 800,
        percent: 20
      }
    },
    {
      id: 6,
      name: 'Riot Division Pants',
      average_rating: 4.8,
      price: 500,
      photo_url: '/items/riot-pants.webp'
    },
    {
      id: 7,
      name: 'MA.STRUM Jacket',
      average_rating: 3.9,
      price: 600,
      photo_url: '/items/mastrum-jacket.jpg'
    },
    {
      id: 8,
      name: 'MA.STRUM Jacket',
      average_rating: 4.5,
      price: 2000,
      photo_url: '/items/mastrum.jpg'
    },
    {
      id: 9,
      name: 'Riot Division Pants',
      average_rating: 4.8,
      price: 500,
      photo_url: '/items/riot-pants.webp'
    }
  ];

  export let data: PageData;
</script>

<div class="mx-auto mt-0 mb-20 w-96 md:w-[78rem]">
  <div class="py-6">
    <Breadcrumbs {sitePath} />
  </div>
  <div class="flex flex-col items-start justify-between gap-5 md:flex-row">
    <Filters
      categories={data.categories}
      colors={data.colors}
      sizes={data.sizes}
      dressStyles={data.dressStyles}
    />
    <main class="flex-grow">
      <div class="hidden md:mb-4 md:block">
        <SearchResultsHeader {...searchResultsHeaderProps} />
      </div>
      <div class="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3">
        {#each items as item, i (item.id)}
          <div>
            <Item {...item} />
          </div>
        {/each}
      </div>
      <hr class="mt-8 mb-5" />
      <div class="mb-20 flex flex-row items-stretch justify-between text-sm md:text-base">
        <button class="rounded-xl border px-3 py-2 md:px-3.5">
          <div class="flex flex-row items-center justify-start gap-0.5 md:gap-2">
            <Arrow class="rotate-180 fill-black" width={24} height={24} />
            Previous
          </div>
        </button>
        <div class="flex flex-row items-center justify-start text-[rgba(0,0,0,.5)]">
          <button class="h-8 w-8 rounded-xl md:h-10 md:w-10">1</button>
          <button class="h-8 w-8 rounded-xl md:h-10 md:w-10">2</button>
          <button class="hidden h-8 w-8 rounded-xl md:block md:h-10 md:w-10">3</button>
          <button class="h-8 w-8 rounded-xl md:h-10 md:w-10">...</button>
          <button class="hidden h-8 w-8 rounded-xl md:block md:h-10 md:w-10">8</button>
          <button class="h-8 w-8 rounded-xl md:h-10 md:w-10">9</button>
          <button class="h-8 w-8 rounded-xl md:h-10 md:w-10">10</button>
        </div>
        <button class="rounded-xl border px-3 py-2 md:px-3.5">
          <div class="flex flex-row items-center justify-start gap-2">
            Next
            <Arrow class="fill-black" width={24} height={24} />
          </div>
        </button>
      </div>
    </main>
  </div>
</div>

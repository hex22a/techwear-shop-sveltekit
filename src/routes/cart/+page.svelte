<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import OrderForm from './OrderForm.svelte';
  import type { PageData } from './$types';

  const sitePath = [
    {
      name: 'Home',
      url: '/'
    },
    {
      name: 'Cart',
      url: '/cart'
    }
  ];

  let { data }: { data: PageData } = $props();
  let cart = $derived(data.cart);
</script>

<div class="mx-auto mt-0 mb-20 w-96 md:w-[78rem]">
  <div class="py-6">
    <Breadcrumbs {sitePath} />
   </div>
   <main>
     <h1 class="mb-14 text-4xl md:mb-6">Your cart</h1>
     <OrderForm {...cart} />
   </main>
</div>

<script lang="ts">
  import { resolve } from '$app/paths';
  import Stars from '$lib/components/Stars.svelte';
  import Price from '$lib/components/Price.svelte';

  interface Props {
    id: number;
    name: string;
    photo_url: string;
    price: number;
    discount?: {
      newPrice: number;
      percent: number;
    };
    average_rating: number;
  }

  let { id, name, photo_url, price, discount, average_rating }: Props = $props();
</script>

<a href={resolve(`/product/${id}`)}>
  <div class="relative mb-4 h-72 overflow-hidden rounded-xl bg-gray-100">
    <img class="object-cover" src={photo_url} alt={`${name} photo`} />
  </div>
  <h3 class="mb-2">{name}</h3>
  <div class="mb-2">
    <Stars rating={average_rating} />
  </div>
  <div>
    <Price {price} {discount} />
  </div>
</a>

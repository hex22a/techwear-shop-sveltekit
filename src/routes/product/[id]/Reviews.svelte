<script lang="ts">
  import styles from './page.module.css';
  import type { ReviewComplete } from '$lib/definitions';
  import Filters from '$lib/icons/filters.svelte';
  import ReviewComponent from '$lib/components/ReviewComponent.svelte';
  import InteractiveStars from './InteractiveStars.svelte';
  import type { ActionData } from './$types';

  export interface ReviewsProps {
    product_id: number;
    reviews: Map<number, ReviewComplete>;
    form?: ActionData;
  }

  let isReviewFormVisible = $state(false);
  let rating = $state(1);

  const openReviewForm = () => (isReviewFormVisible = true);
  const closeReviewForm = () => (isReviewFormVisible = false);

  function setRating(newRating: number) {
    rating = newRating;
  }

  let { reviews, product_id, form }: ReviewsProps = $props();
</script>

<div class="flex items-center justify-between">
  <div>
    <span class="mr-2 font-bold">All reviews</span><span class="opacity-60">(451)</span>
  </div>
  <div class="flex flex-row items-center gap-2.5">
    <button class="rounded-full bg-[rgba(240,240,240,1)] p-2 md:p-3">
      <Filters class="fill-black" width={24} height={24} />
    </button>
    <form class="hidden md:block">
      <select
        class={`${styles.order_select} appearance-none rounded-full p-2 md:p-3 md:px-5`}
        name="order"
        id="order"
      >
        <option value="1">Latest</option>
        <option value="2">Oldest</option>
        <option value="3">Worst to best</option>
        <option value="4">Best to worst</option>
      </select>
    </form>
    <button
      onclick={openReviewForm}
      class="rounded-full bg-black px-3 py-3 text-sm text-white md:px-5 md:py-3.5 md:text-base"
      type="button">Write a review</button
    >
  </div>
</div>
{#if isReviewFormVisible}
  <form method="POST" action="?/submitReview" class="w-full">
    <input type="hidden" name="product_id" value={product_id} />
    <input type="hidden" name="rating" value={rating} />
    <fieldset>
      <legend class="sr-only">Review</legend>
      <label for="review_title">Title:</label>
      <input
        type="text"
        id="review_title"
        name="review_title"
        placeholder="Great product"
        class="my-3 block w-full rounded-xl border p-2"
      />
      <div class="text-sm text-red-500 md:text-base">
        {#if form?.errors?.review_title}
          {#each form.errors.review_title as error (error)}
            <p>{error}</p>
          {/each}
        {/if}
      </div>
      <label class="block" for="review_text">White your review:</label>
      <textarea
        class="my-3 block w-full rounded-xl border p-2"
        name="review_text"
        id="review_text"
        rows={10}
      />
      <div class="text-sm text-red-500 md:text-base">
        {#if form?.errors?.review}
          {#each form.errors.review as error (error)}
            <p>{error}</p>
          {/each}
        {/if}
      </div>
      <label class="block" for="rating">Rating:</label>
      <InteractiveStars {rating} onChange={setRating} />
      <div class="text-sm text-red-500 md:text-base">
        {#if form?.errors?.rating}
          {#each form.errors.rating as error (error)}
            <p>{error}</p>
          {/each}
        {/if}
      </div>
    </fieldset>
    <button
      onclick={closeReviewForm}
      class="mr-1 inline-block rounded-full bg-gray-300 px-3 py-3 text-sm text-black md:px-5 md:py-3.5 md:text-base"
      type="submit"
      >Cancel
    </button>
    <button
      class="inline-block rounded-full bg-black px-3 py-3 text-sm text-white md:px-5 md:py-3.5 md:text-base"
      type="submit"
      >Submit a review
    </button>
    {#if form?.message}
      <div class="text-sm text-red-500 md:text-base">
        {form.message}
      </div>
    {/if}
  </form>
{/if}
<div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
  {#each Array.from(reviews.values()) as review (review.id)}
    <ReviewComponent {...review} />
  {/each}
</div>
<div class="mt-5 text-center md:mt-9">
  <button class="rounded-full border border-gray-500 px-16 py-4">Load More Reviews</button>
</div>

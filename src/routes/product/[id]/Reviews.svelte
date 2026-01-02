<script lang="ts">
	import styles from './page.module.css'
	import type { ReviewComplete } from '$lib/definitions';
	import Filters from '$lib/icons/filters.svelte';
	import ReviewComponent from '$lib/components/ReviewComponent.svelte';
	import InteractiveStars from './InteractiveStars.svelte';
	import type { ActionData } from './$types';

	export interface ReviewsProps {
		product_id: number;
		reviews: Map<number, ReviewComplete>
		form?: ActionData;
	}

	let isReviewFormVisible = $state(false);
	let rating = $state(1);

	const openReviewForm = () => isReviewFormVisible = true;
	const closeReviewForm = () => isReviewFormVisible = false;

	function setRating(newRating: number) {
		rating = newRating;
	}

	let { reviews, product_id, form }: ReviewsProps = $props();
</script>

<div class="flex justify-between items-center">
	<div>
		<span class="font-bold mr-2">All reviews</span><span class="opacity-60">(451)</span>
	</div>
	<div class="flex flex-row items-center gap-2.5">
		<button class="bg-[rgba(240,240,240,1)] rounded-full md:p-3 p-2">
			<Filters class="fill-black" width={24} height={24}/>
		</button>
		<form class="hidden md:block">
			<select class={`${styles.order_select} rounded-full appearance-none md:p-3 md:px-5 p-2`} name="order" id="order">
				<option value="1">Latest</option>
				<option value="2">Oldest</option>
				<option value="3">Worst to best</option>
				<option value="4">Best to worst</option>
			</select>
		</form>
		<button onclick={openReviewForm} class="bg-black text-white text-sm md:text-base rounded-full py-3 md:py-3.5 px-3 md:px-5" type="button">Write a review</button>
	</div>
</div>
{#if isReviewFormVisible}
	<form method="POST" action="?/submitReview" class="w-full">
		<input type="hidden" name="product_id" value={product_id}/>
		<input type="hidden" name="rating" value={rating}/>
		<fieldset>
			<legend class="sr-only">Review</legend>
			<label for="review_title">Title:</label>
			<input type="text" id="review_title" name="review_title" placeholder="Great product"
						 class="block w-full p-2 my-3 border rounded-xl"/>
			<div class="text-red-500 text-sm md:text-base">
				{#if form?.errors?.review_title}
					{#each form.errors.review_title as error}
						<p>{error}</p>
					{/each}
				{/if}
			</div>
			<label class="block" for="review_text">White your review:</label>
			<textarea class="block w-full p-2 my-3 border rounded-xl" name="review_text" id="review_text"
								rows={10}/>
			<div class="text-red-500 text-sm md:text-base">
				{#if form?.errors?.review}
					{#each form.errors.review as error}
						<p>{error}</p>
					{/each}
				{/if}
			</div>
			<label class="block" for="rating">Rating:</label>
			<InteractiveStars rating={rating} onChange={setRating} />
			<div class="text-red-500 text-sm md:text-base">
				{#if form?.errors?.rating}
					{#each form.errors.rating as error (error)}
						<p>{error}</p>
					{/each}
				{/if}
			</div>
		</fieldset>
		<button onclick={closeReviewForm}
						class="inline-block bg-gray-300 text-black text-sm md:text-base rounded-full mr-1 py-3 md:py-3.5 px-3 md:px-5"
						type="submit">Cancel
		</button>
		<button
			class="inline-block bg-black text-white text-sm md:text-base rounded-full py-3 md:py-3.5 px-3 md:px-5"
			type="submit">Submit a review
		</button>
		{#if form?.message}
			<div class="text-red-500 text-sm md:text-base">
				{form.message}
			</div>
		{/if}
	</form>
{/if}
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-10">
	{#each Array.from(reviews.values()) as review (review.id)}
		<ReviewComponent {...review}/>
	{/each}
</div>
<div class="text-center mt-5 md:mt-9">
	<button class="border border-gray-500 rounded-full px-16 py-4">Load More Reviews</button>
</div>

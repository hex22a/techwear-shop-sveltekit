<script lang="ts">
	import colors_style from '$lib/components/colors.module.css';
	import Quantity from './Quantity.svelte';

	interface Props {
		product_id: number;
		colors: Color[];
		sizes: Size[];
	}

	let { product_id, colors, sizes }: Props = $props();
</script>

<form action={formAction}>
	<fieldset>
		<input type='hidden' name='product_id' value={product_id} />
		<legend class="mb-4">Select Colors</legend>
		<div class="flex flex-row justify-start items-center gap-3 md:gap-4">
			{#each colors as color}
				<label for={`color-${color.hex_value}`}>
					<input
						class="hidden peer"
						type="radio"
						name="color_id"
						id={`color-${color.hex_value}`}
						value={color.id}
						aria-checked={true}
					/>
					<div
						class={`${colors_style.radio_mark_check} relative inline-block w-9 h-9 rounded-full`}
						style="backgroundColor: #{color.hex_value}"
						tabIndex={0}
					></div>
				</label>

			{/each}
		</div>
		<div class="text-red-500 text-sm md:text-base">
			{formState?.errors?.color_id &&
			formState.errors.color_id.map((error) => (
				<p key={error}>{error}</p>
			))
			}
		</div>
	</fieldset>
	<hr class="my-6" />
	<fieldset>
		<legend class="mb-4">Choose size</legend>
		<div class="flex flex-row justify-between text-sm md:text-base md:justify-start gap-2 md:gap-3">
			{#each sizes as size}
				<label for={`size-${size.value}`}>
					<input
						class="hidden peer"
						type="radio"
						name="size_id"
						id={`size-${size.value}`}
						value={size.id}
						aria-checked={true}
					/>
					<div
						class="relative inline-block bg-gray-300 rounded-full opacity-60 peer-checked:bg-black peer-checked:text-white peer-checked:opacity-100 py-2.5 px-5 md:py-3 md:px-6"
						tabIndex={0}
					>
						{size.size}
					</div>
				</label>
			{/each}
		</div>
		<div class="text-red-500 text-sm md:text-base">
			{formState?.errors?.size_id &&
			formState.errors.size_id.map((error) => (
				<p key={error}>{error}</p>
			))
			}
		</div>
	</fieldset>
	<hr class="my-6" />
	<div class="flex flex-row justify-between items-stretch text-sm md:text-base w-full gap-3 md:gap-5">
        <span class="bg-gray-200 rounded-full py-3 md:py-3.5 px-3 w-44">
          <Quantity name="quantity" initialQuantity={1} />
        </span>
		<button class="bg-black text-white rounded-full py-3 md:py-3.5 w-full" type="submit">
			Add to Cart
		</button>
	</div>
	{formState?.message && (
		<div class="text-red-500 text-sm md:text-base">
			{formState.message}
		</div>
	)}
</form>

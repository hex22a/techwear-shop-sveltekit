<script lang="ts">
  import styles from './filters.module.css';
  import colors_styles from '$lib/components/colors.module.css';

  import SlimArrow from '$lib/icons/slim-arrow.svelte';
  import FiltersIcon from '$lib/icons/filters.svelte';
  import CrossIcon from '$lib/icons/cross.svelte';
  import SearchResultsHeader from './SearchResutlsHeader.svelte';
  import type { Category, Color, Size, Style } from '$lib/definitions';

  const PRICE_RANGE_MIN = 100;
  const PRICE_RANGE_MAX = 10000;
  const PRICE_RANGE_OFFSET = 2000;
  const PRICE_RANGE_STEP = 10;

  let isFiltersVisible = $state(false);
  let isPriceVisible = $state(true);
  let isColorVisible = $state(true);
  let isSizeVisible = $state(true);
  let isDressStyleVisible = $state(true);

  let minValue = $state(PRICE_RANGE_MIN + PRICE_RANGE_OFFSET);
  let maxValue = $state(PRICE_RANGE_MAX - PRICE_RANGE_OFFSET);

  const searchResultsHeaderProps = {
    indexFirst: 1,
    indexLast: 10,
    totalCount: 100
  };

  interface Props {
    categories: Category[];
    colors: Color[];
    sizes: Size[];
    dressStyles: Style[];
  }

  let { categories, colors, sizes, dressStyles }: Props = $props();

  const togglePrice = () => {
    isPriceVisible = !isPriceVisible;
  };

  const toggleColor = () => {
    isColorVisible = !isColorVisible;
  };

  const toggleSize = () => {
    isSizeVisible = !isSizeVisible;
  };

  const toggleDressStyle = () => {
    isDressStyleVisible = !isDressStyleVisible;
  };

  const openFilters = () => {
    isFiltersVisible = true;
  };

  const closeFilters = () => {
    isFiltersVisible = false;
  };

  const handleMinValueChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    minValue = Math.min(Number(target.value), maxValue - 1);
  };

  const handleMaxValueChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    maxValue = Math.max(Number(target.value), minValue + 1);
  };
</script>

<aside
  class={`${isFiltersVisible ? 'bottom-0' : '-bottom-full'} fixed left-0 z-10 w-full rounded-2xl border border-gray-300 bg-white px-6 py-5 md:static`}
>
  <form>
    <div class="flex flex-row items-center justify-between">
      <span class="font-bold">Filters</span>
      <FiltersIcon class="hidden fill-black opacity-60 md:block" width={24} height={24} />
      <button type="button" class="block md:hidden" onclick={closeFilters}>
        <CrossIcon class="fill-black opacity-60" width={24} height={24} />
      </button>
    </div>
    <hr class="my-6" />
    <ul>
      {#each categories as category (category.id)}
        <li class="flex flex-row items-center justify-between">
          <span>{category.name}</span>
          <SlimArrow class="-rotate-90 fill-black opacity-60" width={16} height={16} />
        </li>
      {/each}
    </ul>
    <hr class="my-6" />
    <button type="button" class="w-full" onclick={togglePrice}>
      <div class="flex flex-row items-center justify-between">
        <span class="font-bold">Price</span>
        <SlimArrow
          class={`fill-black opacity-60 ${
            !isPriceVisible ? '-rotate-90' : ''
          } transition-all duration-500`}
          width={16}
          height={16}
        />
      </div>
    </button>
    {#if isPriceVisible}
      <div class="mt-4">
        <div class="relative flex h-8 items-center">
          <div class="absolute right-0 left-0 h-1 rounded-full bg-gray-300"></div>

          <div
            class="pointer-events-none absolute h-1 rounded-full bg-black"
            style="
							left: {((minValue - PRICE_RANGE_MIN) / (PRICE_RANGE_MAX - PRICE_RANGE_MIN)) * 100}%;
							width: {((maxValue - minValue) / (PRICE_RANGE_MAX - PRICE_RANGE_MIN)) * 100}%
						"
          ></div>

          <input
            type="range"
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            step={PRICE_RANGE_STEP}
            value={minValue}
            onchange={handleMinValueChange}
            class={`${styles.min_input} pointer-events-none absolute z-10 h-0.5 w-full appearance-none bg-transparent`}
          />

          <input
            type="range"
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            step={PRICE_RANGE_STEP}
            value={maxValue}
            onchange={handleMaxValueChange}
            class="pointer-events-auto absolute h-0 w-full appearance-none bg-transparent"
          />
        </div>
        <div class="relative h-4">
          <span
            class="absolute -translate-x-1/2"
            style="left: {((minValue - PRICE_RANGE_MIN) / (PRICE_RANGE_MAX - PRICE_RANGE_MIN)) *
              100}%"
          >
            ${minValue}
          </span>
          <span
            class="absolute -translate-x-1/2"
            style="left: {((maxValue - PRICE_RANGE_MIN) / (PRICE_RANGE_MAX - PRICE_RANGE_MIN)) *
              100}%"
          >
            ${maxValue}
          </span>
        </div>
      </div>
    {/if}
    <hr class="my-6" />
    <fieldset>
      <button type="button" class="w-full" onclick={toggleColor}>
        <div class="flex flex-row items-center justify-between">
          <legend class="font-bold">Color</legend>
          <SlimArrow
            class={`fill-black opacity-60 ${
              !isColorVisible ? '-rotate-90' : ''
            } transition-all duration-500`}
            width={16}
            height={16}
          />
        </div>
      </button>
      {#if isColorVisible}
        <div class="mt-4 grid grid-cols-5 gap-2">
          {#each colors as color (color.id)}
            <label for={`color-${color.hex_value}`}>
              <input
                class="peer hidden"
                type="radio"
                name="color"
                id={`color-${color.hex_value}`}
                value="green"
                aria-checked={true}
              />
              <div
                class="{colors_styles.radio_mark_check} relative inline-block h-9 w-9 rounded-full"
                style="background-color: #{color.hex_value}"
                tabIndex={0}
              ></div>
            </label>
          {/each}
        </div>
      {/if}
    </fieldset>
    <hr class="my-6" />
    <fieldset>
      <button type="button" class="w-full" onclick={toggleSize}>
        <div class="flex flex-row items-center justify-between">
          <legend class="font-bold">Size</legend>
          <SlimArrow
            class={`fill-black opacity-60 ${
              !isSizeVisible ? '-rotate-90' : ''
            } transition-all duration-500`}
            width={16}
            height={16}
          />
        </div>
      </button>
      {#if isSizeVisible}
        <div class="mt-4">
          {#each sizes as size (size.id)}
            <label for={`size-${size.value}`}>
              <input
                class="peer hidden"
                type="radio"
                name="size"
                id={`size-${size.value}`}
                value={size.value}
                aria-checked={true}
              />
              <div
                class="relative m-2 inline-block rounded-full bg-gray-300 px-5 py-2.5 opacity-60 peer-checked:bg-black peer-checked:text-white peer-checked:opacity-100 md:px-6 md:py-3"
                tabIndex={0}
              >
                {size.size}
              </div>
            </label>
          {/each}
        </div>
      {/if}
    </fieldset>
    <hr class="my-6" />
    <fieldset>
      <button type="button" class="w-full" onclick={toggleDressStyle}>
        <div class="flex flex-row items-center justify-between">
          <legend class="font-bold">Dress Style</legend>
          <SlimArrow
            class={`fill-black opacity-60 ${
              !isDressStyleVisible ? '-rotate-90' : ''
            } transition-all duration-500`}
            width={16}
            height={16}
          />
        </div>
      </button>
      {#if isDressStyleVisible}
        <ul>
          {#each dressStyles as dressStyle (dressStyle.id)}
            <li class="flex flex-row items-center justify-between">
              <span>{dressStyle.name}</span>
              <SlimArrow class="-rotate-90 fill-black opacity-60" width={16} height={16} />
            </li>
          {/each}
        </ul>
      {/if}
    </fieldset>
    <button type="submit" class="mt-6 w-full rounded-full bg-black py-3.5 text-white"
      >Apply Filters</button
    >
  </form>
</aside>
<div class="block w-full md:hidden">
  <SearchResultsHeader onFiltersClick={openFilters} {...searchResultsHeaderProps} />
</div>

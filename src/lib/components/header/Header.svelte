<script>
  import { resolve } from '$app/paths';

  import Burger from '$lib/icons/burger.svelte';
  import Cross from '$lib/icons/cross.svelte';
  import SlimArrow from '$lib/icons/slim-arrow.svelte';
  import Cart from '$lib/icons/cart.svelte';
  import Search from '$lib/icons/search.svelte';

  let isDiscountVisible = true;
  let isSearchExpanded = false;
  let isLinkGroupVisible = false;

  function closeDiscount() {
    isDiscountVisible = false;
  }

  function toggleLinkGroup() {
    isLinkGroupVisible = !isLinkGroupVisible;
  }

  function toggleSearch() {
    isSearchExpanded = !isSearchExpanded;
  }
</script>

<header class="sticky top-0 right-0 left-0 z-50 w-full">
  {#if isDiscountVisible}
    <div class="z-50 bg-black py-2.5 text-center text-xs text-white md:text-base">
      <div class="relative mx-auto my-0 max-w-96 md:max-w-[78rem]">
        Sign up and get 20% off to your first order. <a class="underline" href={resolve('/signup')}
          >Sign Up Now</a
        >
        <button onclick={closeDiscount} class="absolute top-0.5 right-0 hidden md:block">
          <Cross height={20} width={20} fill="#fff" />
        </button>
      </div>
    </div>
  {/if}
  <nav class="z-40 bg-white py-6 md:py-9">
    <div
      class="mx-auto my-0 flex max-w-96 flex-row items-center justify-between md:max-w-[78rem] md:gap-10"
    >
      <button onclick={toggleLinkGroup} class="md:hidden">
        <Burger height={24} width={24} />
      </button>
      <a href={resolve('/')}>
        <h1
          class={`${isSearchExpanded ? 'hidden' : 'block'} text-xl text-nowrap md:block md:text-3xl`}
        >
          Tech Shop
        </h1>
      </a>
      <ul
        class={`${isLinkGroupVisible ? 'bottom-0' : '-bottom-full'} fixed left-0  flex w-full flex-col items-center gap-6 rounded-t-3xl bg-white py-6 transition-all duration-200 ease-in-out md:static md:w-auto md:flex-row md:justify-start md:py-0`}
        role="menu"
      >
        <li class="group relative" role="menuitem">
          <input type="checkbox" id="submenu-toggle" class="peer hidden" />
          <label
            class="cursor-pointer"
            for="submenu-toggle"
            aria-controls="submenu"
            tabIndex={0}
            role="button"
          >
            Shop <SlimArrow class="inline fill-black" width={16} height={16} />
          </label>
          <ul
            class="absolute top-6 left-0 hidden w-28 rounded-xl bg-white p-1.5 shadow-lg group-focus-within:block group-hover:block peer-checked:block peer-focus-within:block focus-within:block"
          >
            <li role="menuitem"><a href="#">SS2025</a></li>
            <li role="menuitem"><a href="#">FW2024</a></li>
            <li role="menuitem"><a href="#">Men</a></li>
            <li role="menuitem"><a href="#">Women</a></li>
            <li role="menuitem"><a href="#">Kids</a></li>
          </ul>
        </li>
        <li><a role="menuitem" href="#">On Sale</a></li>
        <li><a role="menuitem" href="#">New Arrivals</a></li>
        <li><a role="menuitem" href="#">Brands</a></li>
      </ul>
      <div class="flex flex-row flex-nowrap items-center justify-between gap-3 md:flex-grow">
        <form class="md:flex-grow">
          <label onclick={toggleSearch} class="relative" for="nav-search">
            <Search
              class={`${isSearchExpanded ? 'top-1.5 left-4 opacity-40' : 'top-0 right-0 opacity-100'} absolute fill-black transition-opacity duration-500 ease-in-out md:absolute md:top-3.5 md:left-4 md:opacity-40`}
              height={24}
              width={24}
            />
          </label>
          <input
            id="nav-search"
            type="text"
            class={`bg-[rgba(240,240,240,1)] md:block ${isSearchExpanded ? 'block max-w-xl py-1.5 pl-11' : 'max-w-0'} rounded-full transition-all duration-500 ease-in-out md:w-full md:max-w-xl md:py-3.5 md:pl-14`}
            placeholder="Search for products..."
          />
        </form>
        <a href={resolve('/cart')}>
          <Cart />
        </a>
        <!--          <SessionProvider>-->
        <!--            <UserButton />-->
        <!--          </SessionProvider>-->
      </div>
    </div>
  </nav>
</header>

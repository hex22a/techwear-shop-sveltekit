<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import UserPic from '$lib/icons/userpic.svelte';
  import WebauthnForm from '$lib/components/header/WebauthnForm.svelte';

  let isMiniSignInVisible = $state(false);

  function toggleMiniSignIn() {
    isMiniSignInVisible = !isMiniSignInVisible;
  }
</script>

<div class="relative">
  <a class="block md:hidden" href={resolve('/signin')}>
    <UserPic />
  </a>
  <button onclick={toggleMiniSignIn} class="hidden md:block">
    <UserPic />
  </button>
  {#if isMiniSignInVisible}
    <div class="absolute top-10 right-0 w-72 rounded-xl bg-black p-4 text-white shadow-lg">
      {#if page.data.session}
        <form action="/api/signout" method="POST">
          <button type="submit" class="w-full rounded-full border border-white text-white"
            >Sign Out</button
          >
        </form>
      {:else}
        <WebauthnForm />
      {/if}
    </div>
  {/if}
</div>

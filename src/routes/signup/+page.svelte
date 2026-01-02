<script>
  import { resolve } from '$app/paths';

  import SignupForm from '$lib/components/SignupForm.svelte';
</script>

<main class="mt-5 mb-20 flex flex-grow flex-row items-center justify-center">
  <div class="w-96 rounded-xl border p-4">
    <SignupForm />
    <div class="text-center">
      Already have an account? <a class="underline" href={resolve('/signin')}>Sign In</a>
    </div>
  </div>
</main>

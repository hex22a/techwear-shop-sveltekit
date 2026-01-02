<script>
	import { resolve } from '$app/paths';

	import SignupForm from '$lib/components/SignupForm.svelte';
</script>

<main class="flex-grow flex flex-row justify-center items-center mt-5 mb-20">
	<div class="border rounded-xl p-4 w-96">
		<SignupForm />
		<div class="text-center">Already have an account? <a class="underline" href={resolve("/signin")}>Sign In</a></div>
	</div>
</main>

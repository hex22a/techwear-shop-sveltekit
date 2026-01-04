<script lang="ts">
	import SignupForm from '$lib/components/SignupForm.svelte';
	import SignInForm from '$lib/components/SigninForm.svelte';

	let isSignInFormVisible = $state(true);
	const toggleSignInVisibility = () => isSignInFormVisible = !isSignInFormVisible;

</script>

{#if isSignInFormVisible}
	<SignInForm/>
	<div class="text-center">Don&#39;t have an account? <button class="underline" onclick={toggleSignInVisibility}>Sign Up</button></div>
{:else}
	<SignupForm />
	<div class="text-center">Already have an account? <button class="underline" onclick={toggleSignInVisibility}>Sign In</button></div>
{/if}

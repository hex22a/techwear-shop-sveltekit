<script lang="ts">
  import ErrorComponent from './ErrorComponent.svelte';
  import form_style from './Form.module.css';
  import { type WebAuthnResponse } from '$lib/webauthn.server';
  import { z } from 'zod';
  import { startAuthentication } from '@simplewebauthn/browser';

  let error = $state('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const parsedCredentials = z
      .object({ username: z.string().nonempty() })
      .safeParse(Object.fromEntries(formData.entries()));
    if (!parsedCredentials.success) {
      return;
    }

    const optionsRes = await fetch('/api/webauthn/login/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: parsedCredentials.data.username })
    });

    const response: WebAuthnResponse = await optionsRes.json();

    if (!response.success || !response.data) {
      error = response.message ?? 'Something went wrong!';
      return;
    }

    try {
      const parsedOptions = response.data as PublicKeyCredentialRequestOptionsJSON;
      const localResponse = await startAuthentication({ optionsJSON: parsedOptions });
      const result = await signIn('credentials', {
        redirect: false,
        username: parsedCredentials.data.username,
        webauthnResponse: JSON.stringify(localResponse)
      });

      if (result?.error) {
        error = 'Authentication failed.';
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error, error.message);
      }
    }
  };
</script>

<form onsubmit={handleSubmit}>
  <label class={`${form_style.username} block text-center`} for="username">Username</label>
  <input
    class="mb-3 block w-full rounded-full border px-14 py-3.5 text-black"
    id="username"
    name="username"
    type="text"
  />
  <hr class="my-4" />
  <button
    type="submit"
    class="mb-3 block w-full rounded-full border bg-black px-14 py-3.5 text-white">Sign In</button
  >
  {#if error !== ''}
    <ErrorComponent message={error} onClose={() => (error = '')} />
  {/if}
</form>

<script lang="ts">
  import form_style from './Form.module.css';
  import { startRegistration } from '@simplewebauthn/browser';

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username')?.toString();

    if (!username) {
      return;
    }

    const optionsRes = await fetch('/api/webauthn/register/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const optionsResponse = await optionsRes.json();

    if (!optionsResponse.success || !optionsResponse.data) {
      alert(optionsResponse.message ?? 'Something went wrong!');
      return;
    }

    const localResponse = await startRegistration({ optionsJSON: optionsResponse.data });
    const verifyRes = await fetch('/api/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localResponse })
    });

    const verifyResponse = await verifyRes.json();

    if (!verifyResponse.success) {
      alert(verifyResponse.message ?? 'Something went wrong!');
      return;
    }

    alert('Registration successful!');
  }
</script>

<form onsubmit={handleSubmit}>
  <label class={`${form_style.username} block text-center`} for="username">Username</label>
  <input
    class="mb-3 block w-full rounded-full border px-14 py-3.5 text-black"
    name="username"
    id="username"
    type="text"
  />
  <hr class="my-4" />
  <button
    type="submit"
    class="mb-3 block w-full rounded-full border bg-black px-14 py-3.5 text-white">Sign Up</button
  >
</form>

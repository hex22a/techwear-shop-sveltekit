import { SvelteKitAuth } from '@auth/sveltekit';
import Passkey from '@auth/sveltekit/providers/passkey';
import { CustomWebAuthnAdapter } from '$lib/auth_adapter';

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: CustomWebAuthnAdapter(), // Required for Passkey
  providers: [
    Passkey({
      // Auth.js handles WebAuthn signin
      name: 'Passkey',
      formFields: {
        email: {
          label: 'Username',
          required: true,
          autocomplete: 'username webauthn'
        }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'database' // Required for Passkey
  },
  experimental: { enableWebAuthn: true },
  trustHost: true,
  debug: true
});

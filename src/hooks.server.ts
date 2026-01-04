import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import { findUser } from '$lib/model/data/user.server';

export const { handle } = SvelteKitAuth({
  providers: [
    Credentials({
      id: 'webauthn',
      name: 'WebAuthn',
      credentials: {
        username: { label: 'Username', type: 'text' },
        webauthnVerified: { label: 'WebAuthn Verified', type: 'boolean' }
      },
      async authorize(credentials) {
        // This is called AFTER your manual WebAuthn verification
        // Just validate that verification happened
        console.log(credentials);
        if (credentials.webauthnVerified) {
          // Get user from database
          const user = await findUser(credentials.username as string);
          console.log(user);

          if (user) {
            return {
              id: user.id.toString(),
              name: user.username
            };
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  }
});

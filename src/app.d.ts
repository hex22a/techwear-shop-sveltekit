// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { UserSessionData } from '$lib/session';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: UserSessionData | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};

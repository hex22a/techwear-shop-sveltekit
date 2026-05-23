// Re-export auth helpers and types from the canonical location (auth.server.ts).
export type { Session } from './auth.server';
export { getSession, isAuthenticated } from './auth.server';

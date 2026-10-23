/**
 * Resolves the Vendure Shop API endpoint depending on execution context.
 * In Docker / server-side Node.js runtime, it connects via internal Docker network (e.g. http://api:3001/shop-api).
 * In the user's browser, it connects via external exposed port (e.g. http://localhost:3001/shop-api).
 */
export function getApiUrl(): string {
    if (typeof window === 'undefined') {
        return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/shop-api';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/shop-api';
}

import Vapi from "@vapi-ai/web";

// Initialize Vapi client
let vapiInstance: Vapi | null = null;

export function getVapi(): Vapi {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // During SSR/build time, return a mock object to prevent errors
    return {} as Vapi;
  }

  if (!vapiInstance) {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      throw new Error("NEXT_PUBLIC_VAPI_PUBLIC_KEY is not configured");
    }

    vapiInstance = new Vapi(publicKey);
  }

  return vapiInstance;
}

// Export singleton instance getter (lazy initialization)
export const vapi = getVapi();
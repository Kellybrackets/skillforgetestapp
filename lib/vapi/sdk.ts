import Vapi from "@vapi-ai/web";

// Initialize Vapi client
let vapiInstance: Vapi | null = null;

export function getVapi(): Vapi {
  if (!vapiInstance) {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      throw new Error("NEXT_PUBLIC_VAPI_PUBLIC_KEY is not configured");
    }

    vapiInstance = new Vapi(publicKey);
  }

  return vapiInstance;
}

// Export singleton instance
export const vapi = getVapi();
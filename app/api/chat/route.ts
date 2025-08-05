// This is a mock API route that would normally use the Vercel AI SDK
// Since we're using a static response, we don't need to use the actual SDK
export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get the last message from the user
  const lastMessage = messages[messages.length - 1]

  // Create a static response
  const response = `I recommend our Introduction to Machine Learning course! This course is designed to help you build a strong foundation and advance your skills. Would you like to know more about the curriculum?`

  // Create a text encoder
  const encoder = new TextEncoder()

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      // Split the response into words and send them one by one
      const words = response.split(" ")

      for (const word of words) {
        controller.enqueue(encoder.encode(word + " "))
        // Add a small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      controller.close()
    },
  })

  // Return a streaming response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}

import type { APIRoute } from 'astro'
import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: import.meta.env.OPEN_AI_KEY,
})
export const GET: APIRoute = async ({ params }) => {
    const data = [e`الفاتحة - `]
    client.embeddings.create({
        input,
    })
    return new Response(JSON.stringify({}), { status: 200 })
}

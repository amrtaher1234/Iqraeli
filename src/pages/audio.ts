import type { APIRoute } from 'astro'
import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: import.meta.env.OPEN_AI_KEY,
})

async function sendToOpenAI(file: File) {
    const result = await client.audio.transcriptions.create({
        model: 'whisper-1',
        file: file,
        language: 'ar',
    })
    return result.text
}
const run = async (text = '') => {
    const responseForSurah = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'user',
                content: `Given this verse from a quran surah, give me the surah name, aya number: ${text}.
          
          Data should be in JSON format with these fields:
          
          {
              surahName: string, // in arabic
              ayaNumber: number,
              confidence: number, // how much confident out of 100 the result is,
              surahNumber: number, // number of surah in quran
          }`,
            },
        ],
    })

    return responseForSurah.choices[0].message
}

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData()

    const file = data.get('audio') as File
    const response = await sendToOpenAI(file).catch((err) => {
        throw new Error(err)
    })
    try {
        const { surahNumber, ayaNumber } = JSON.parse(
            (await run(response)).content ?? '{}'
        )

        return new Response(
            JSON.stringify({
                surahNumber,
                ayaNumber,
            }),
            { status: 200 }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({
                message:
                    'Was unable to get the surah or ayah number from audip',
            }),
            {
                status: 500,
            }
        )
    }
}

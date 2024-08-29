import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

async function sendToOpenAI(file: File) {
  const result = await client.audio.transcriptions.create({
    model: "whisper-1",
    file: file,
    language: "ar",
  });
  return result.text;
}
const run = async (text = "") => {
  const embedding = (
    await client.embeddings.create({
      input: text,
      model: "text-embedding-ada-002",
    })
  ).data[0].embedding;

  const index = pinecone.Index("quran");
  const result = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
    includeValues: false,
  });
  return result.matches;
};

export async function POST(request: Request) {
  const data = await request.formData();

  const file = data.get("audio") as File;
  const response = await sendToOpenAI(file).catch((err) => {
    throw new Error(err);
  });
  try {
    const matches = await run(response);

    return new Response(
      JSON.stringify({
        matches,
        text: response,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Was unable to get the surah or ayah number from audio",
      }),
      {
        status: 500,
      },
    );
  }
}

import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

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
  const { text } = await request.json();

  try {
    const matches = await run(text);

    return new Response(
      JSON.stringify({
        matches,
        text: text,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Was unable to get the surah or ayah number from audio",
        error: err,
      }),
      {
        status: 500,
      },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

/* ---------- helpers ---------- */

function buildPrompt(answers: string[]): string {
  const [
    place = 'a mystical realm',
    power = 'arcane magic',
    companions = 'mysterious allies',
    role = 'hero',
    vibe = 'epic',
    goal = 'seek ultimate truth',
    aesthetic = 'high-fantasy',
  ] = answers;

  return `
A highly-detailed cinematic fantasy portrait.
Setting • ${place} rendered in a ${aesthetic} style.
The subject wields ${power} and is surrounded by ${companions}.
Role • ${role}. Vibe • ${vibe}. Life mission • ${goal}.
– Ultra-realistic, dramatic lighting, 8k resolution.
`.trim();
}

async function uploadSelfie(base64: string): Promise<string> {
  const res = await fetch('https://api.replicate.com/v1/upload', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: base64,
      content_type: 'image/png',
    }),
  });

  if (!res.ok) {
    console.error('Failed to upload selfie', await res.text());
    throw new Error('SELFIE_UPLOAD_FAILED');
  }

  const { url } = await res.json();
  return url as string;
}

/* ---------- POST /api/generate ---------- */

export async function POST(req: NextRequest) {
  try {
    const { answers, selfie } = await req.json();

    const prompt = buildPrompt(answers);
    const selfieUrl = await uploadSelfie(selfie);

    const output = await replicate.run('fofr/facefusion:latest', {
      input: {
        target_image: selfieUrl, // user’s selfie (public URL)
        prompt,                  // fantasy description
        style: 'cinematic',
      },
    });

    const imageUrl = Array.isArray(output) ? output[0] : (output as string);
    return NextResponse.json({ url: imageUrl });
  } catch (err) {
    console.error('Generate route error', err);
    return NextResponse.json(
      { error: 'Failed to create fantasy image.' },
      { status: 500 },
    );
  }
}

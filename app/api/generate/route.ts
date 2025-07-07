import { NextRequest, NextResponse } from 'next/server';
    import Replicate from 'replicate';

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || ''
    });

    function buildPrompt(answers: string[]) {
      const [place, power, companions, role, vibe, goal, aesthetic] = answers;
      return \`
A highly detailed cinematic fantasy portrait.
Setting: \${place} in a \${aesthetic} style.
Subject wields \${power}, surrounded by \${companions}.
Role: \${role}. Vibe: \${vibe}. Life mission: \${goal}.
\`;
    }

    async function uploadImage(base64: string) {
      // Replicate upload helper – returns a URL Replicate can read
      const res = await fetch('https://api.replicate.com/v1/upload', {
        method: 'POST',
        headers: {
          Authorization: \`Token \${process.env.REPLICATE_API_TOKEN}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: base64, content_type: 'image/png' })
      });
      const data = await res.json();
      return data?.url as string;
    }

    export async function POST(req: NextRequest) {
      const { answers, selfie } = await req.json();
      const prompt = buildPrompt(answers);

      // Upload the selfie and get a public URL
      const selfieUrl = await uploadImage(selfie);

      const output = await replicate.run(
        "fofr/facefusion:latest",
        {
          input: {
            target_image: selfieUrl,
            prompt,
            style: "cinematic"
          }
        }
      );

      // facefusion returns an array of image urls; pick first
      const url = Array.isArray(output) ? output[0] : output as string;
      return NextResponse.json({ url });
    }
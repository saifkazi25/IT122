'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    if (!file) return;
    setLoading(true);

    const base64 = await new Promise<string>((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result as string);
      fr.readAsDataURL(file);
    });

    const answers = JSON.parse(sessionStorage.getItem('quizAnswers') || '[]');

    const r = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, selfie: base64 }),
    });

    const { url } = await r.json();
    router.push(`/result?img=${encodeURIComponent(url)}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">Upload Your Selfie</h1>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="mt-4 px-6 py-2 bg-black text-white rounded"
              disabled={!file || loading}
              onClick={handleGenerate}>
        {loading ? 'Creating…' : 'See My Fantasy'}
      </button>
    </div>
  );
}
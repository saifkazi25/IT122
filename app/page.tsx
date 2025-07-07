'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ResultContent() {
  const params = useSearchParams();
  const imgUrl = params.get('img');
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizAnswers');
    if (stored) setAnswers(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-6">
      <h1 className="text-2xl font-bold">Your Infinite Tsukuyomi</h1>

      {imgUrl ? (
        <img src={imgUrl} alt="Fantasy portrait" className="rounded-xl shadow-xl max-w-full" />
      ) : (
        <p>Generating image… If this takes more than 30 s, refresh.</p>
      )}

      <details className="w-full max-w-md bg-gray-100 p-4 rounded-lg">
        <summary className="cursor-pointer font-semibold">See your answers</summary>
        <ul className="list-disc pl-6 mt-2">
          {answers.map((a, i) => (
            <li key={i}><strong>Q{i + 1}:</strong> {a}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading your fantasy...</div>}>
      <ResultContent />
    </Suspense>
  );
}

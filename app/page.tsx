'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function ResultContent() {
  const params = useSearchParams()
  const imgUrl = params.get('img')
  const [answers, setAnswers] = useState<string[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('quizAnswers')
    if (stored) setAnswers(JSON.parse(stored))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-6">
      <h1 className="text-2xl font-bold">Your Infinite Tsukuyomi</h1>

      {imgUrl ? (
        <img
          src={imgUrl}
          alt="Your fantasy"
          className="rounded-lg shadow-lg max-w-full"
        />
      ) : (
        <p>Generating your fantasy image…</p>
      )}

      <details className="w-full max-w-md bg-gray-100 p-4 rounded-lg">
        <summary className="cursor-pointer font-semibold">See your answers</summary>
        <ul className="list-disc pl-6 mt-2">
          {answers.map((ans, idx) => (
            <li key={idx}><strong>Q{idx + 1}:</strong> {ans}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ResultContent />
    </Suspense>
  )
}

// ❗️Tells Next.js: Do NOT statically render this page
export const dynamic = 'force-dynamic'
export const runtime = 'edge'



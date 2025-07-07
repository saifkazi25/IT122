/* app/result/page.tsx */
'use client'

import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'   // skip pre-render
// -- no useSearchParams() anywhere in this file --

export default function ResultPage() {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])

  useEffect(() => {
    // read ?img=... from current URL
    const params = new URLSearchParams(window.location.search)
    setImgUrl(params.get('img'))

    // restore quiz answers from sessionStorage
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




'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "./questions";

export default function QuizPage() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const handleNext = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      sessionStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
      router.push("/selfie");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-xl font-semibold mb-6">{questions[current]}</h1>
      <input
        type="text"
        placeholder="Type your answer..."
        className="p-2 border rounded w-full max-w-md mb-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleNext((e.target as HTMLInputElement).value);
        }}
      />
      <p className="text-sm text-gray-500">Press Enter to continue</p>
    </div>
  );
}
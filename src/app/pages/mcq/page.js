"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SkillQuiz() {
  const [skill, setSkill] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchQuestions = async () => {
    const res = await fetch("/api/skillsmcq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill }),
    });
    const data = await res.json();
    setQuestions(data.questions || []);
    setCurrent(0);
    setScore(0);
    setSelected("");
    setShowAnswer(false);
    setCompleted(false);
  };

  const handleAnswer = (optionKey) => {
    setSelected(optionKey);
    setShowAnswer(true);
    if (optionKey === questions[current].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setSelected("");
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  if (!questions.length) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 space-y-4">
        <h2 className="text-xl font-bold">Start Skill Quiz</h2>
        <Input
          placeholder="Enter skill (e.g., Node.js)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <Button onClick={fetchQuestions}>Start Quiz</Button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 space-y-4 text-center">
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p className="text-lg">Your Score: {score} / {questions.length}</p>
        <Button onClick={() => setQuestions([])}>Try Another Skill</Button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 space-y-6">
      <h2 className="text-lg font-semibold">Question {current + 1} of {questions.length}</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-medium">{q.question}</p>
          {Object.entries(q.options).map(([key, value]) => (
            <Button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={showAnswer}
              variant={selected === key ? "default" : "outline"}
              className={`w-full justify-start ${
                showAnswer && key === q.correct
                  ? "bg-green-100 border-green-500"
                  : showAnswer && selected === key && key !== q.correct
                  ? "bg-red-100 border-red-500"
                  : ""
              }`}
            >
              {key}. {value}
            </Button>
          ))}
          {showAnswer && (
            <p className="text-sm text-muted-foreground">
              <strong>Explanation:</strong> {q.explanation}
            </p>
          )}
          {showAnswer && (
            <Button onClick={nextQuestion} className="w-full mt-2">
              Next
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

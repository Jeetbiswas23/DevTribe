import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function MCQRound() {
  const { hackathonId, roundId } = useParams()
  const navigate = useNavigate()
  const [round, setRound] = useState(null)
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Load round data
    const mockRound = {
      id: roundId,
      hackathonId,
      name: "Technical Screening",
      type: "MCQ",
      duration: 30, // minutes
      totalQuestions: 10,
      passingScore: 60,
      negativeMarking: true,
      negativeMarkingValue: 0.25,
      shuffleQuestions: true,
      shuffleOptions: true,
      questions: [
        {
          id: 1,
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correctAnswer: 1,
          difficulty: "Easy",
          marks: 1
        },
        {
          id: 2,
          question: "Which data structure uses LIFO (Last In First Out)?",
          options: ["Queue", "Stack", "Array", "Tree"],
          correctAnswer: 1,
          difficulty: "Easy",
          marks: 1
        },
        {
          id: 3,
          question: "What does REST stand for?",
          options: [
            "Representational State Transfer",
            "Remote Execution State Transfer",
            "Rapid State Transition",
            "Resource Execution State Transfer"
          ],
          correctAnswer: 0,
          difficulty: "Medium",
          marks: 2
        },
        {
          id: 4,
          question: "Which sorting algorithm has the best average-case time complexity?",
          options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
          correctAnswer: 1,
          difficulty: "Medium",
          marks: 2
        },
        {
          id: 5,
          question: "In React, what is used to pass data from parent to child component?",
          options: ["State", "Props", "Context", "Redux"],
          correctAnswer: 1,
          difficulty: "Easy",
          marks: 1
        },
        {
          id: 6,
          question: "What is the purpose of useEffect in React?",
          options: [
            "To manage state",
            "To handle side effects",
            "To create components",
            "To optimize rendering"
          ],
          correctAnswer: 1,
          difficulty: "Medium",
          marks: 2
        },
        {
          id: 7,
          question: "Which of the following is NOT a valid HTTP method?",
          options: ["GET", "POST", "REMOVE", "DELETE"],
          correctAnswer: 2,
          difficulty: "Easy",
          marks: 1
        },
        {
          id: 8,
          question: "What is the output of: console.log(typeof null)?",
          options: ["'null'", "'object'", "'undefined'", "'number'"],
          correctAnswer: 1,
          difficulty: "Hard",
          marks: 3
        },
        {
          id: 9,
          question: "Which database is NOT a NoSQL database?",
          options: ["MongoDB", "PostgreSQL", "Cassandra", "Redis"],
          correctAnswer: 1,
          difficulty: "Medium",
          marks: 2
        },
        {
          id: 10,
          question: "What is the maximum number of parameters a JavaScript function can have?",
          options: ["255", "256", "No limit", "1024"],
          correctAnswer: 2,
          difficulty: "Hard",
          marks: 3
        }
      ]
    }

    // Shuffle questions if enabled
    if (mockRound.shuffleQuestions) {
      mockRound.questions = [...mockRound.questions].sort(() => Math.random() - 0.5)
    }

    // Shuffle options if enabled
    if (mockRound.shuffleOptions) {
      mockRound.questions = mockRound.questions.map(q => {
        const options = [...q.options]
        const correctOption = options[q.correctAnswer]
        const shuffled = [...options].sort(() => Math.random() - 0.5)
        return {
          ...q,
          options: shuffled,
          correctAnswer: shuffled.indexOf(correctOption)
        }
      })
    }

    setRound(mockRound)
    setTimeLeft(mockRound.duration * 60) // Convert to seconds
  }, [hackathonId, roundId])

  useEffect(() => {
    if (started && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [started, timeLeft, showResults])

  const handleStart = () => {
    setStarted(true)
  }

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handleSubmit = () => {
    let totalScore = 0
    let correctCount = 0
    let wrongCount = 0

    round.questions.forEach(q => {
      const userAnswer = answers[q.id]
      if (userAnswer !== undefined) {
        if (userAnswer === q.correctAnswer) {
          totalScore += q.marks
          correctCount++
        } else if (round.negativeMarking) {
          totalScore -= (q.marks * round.negativeMarkingValue)
          wrongCount++
        } else {
          wrongCount++
        }
      }
    })

    setScore(totalScore)
    setShowResults(true)

    // Save results
    const results = {
      hackathonId,
      roundId,
      score: totalScore,
      totalQuestions: round.questions.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unattempted: round.questions.length - correctCount - wrongCount,
      timestamp: new Date().toISOString()
    }
    
    const existingResults = JSON.parse(localStorage.getItem('round_results') || '[]')
    existingResults.push(results)
    localStorage.setItem('round_results', JSON.stringify(existingResults))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/30'
    }
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Start Screen
  if (!started) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/dashboard/hackathons/${hackathonId}`)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Hackathon
        </button>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-2xl mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{round.name}</h1>
            <p className="text-neutral-400">Multiple Choice Questions Round</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Duration</div>
              <div className="text-white font-semibold text-lg">{round.duration} minutes</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Total Questions</div>
              <div className="text-white font-semibold text-lg">{round.totalQuestions}</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Passing Score</div>
              <div className="text-white font-semibold text-lg">{round.passingScore}%</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Negative Marking</div>
              <div className="text-white font-semibold text-lg">
                {round.negativeMarking ? `-${round.negativeMarkingValue} per wrong answer` : 'No'}
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Instructions
            </h3>
            <ul className="text-yellow-200/80 text-sm space-y-1">
              <li>• Questions and options are shuffled randomly</li>
              <li>• You can navigate between questions freely</li>
              <li>• Timer will start once you click "Start Test"</li>
              <li>• Test will auto-submit when time runs out</li>
              <li>• Make sure you have a stable internet connection</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all text-lg"
          >
            Start Test
          </button>
        </div>
      </div>
    )
  }

  // Results Screen
  if (showResults) {
    const totalMarks = round.questions.reduce((sum, q) => sum + q.marks, 0)
    const percentage = ((score / totalMarks) * 100).toFixed(2)
    const passed = percentage >= round.passingScore

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 ${passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-2xl mb-4`}>
              <span className="text-6xl">{passed ? '🎉' : '😔'}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {passed ? 'Congratulations!' : 'Test Completed'}
            </h1>
            <p className="text-neutral-400">
              {passed ? 'You have passed this round!' : 'Better luck next time'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{score.toFixed(2)}</div>
              <div className="text-neutral-400 text-sm">Score</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{percentage}%</div>
              <div className="text-neutral-400 text-sm">Percentage</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Object.values(answers).filter((ans, idx) => ans === round.questions[idx]?.correctAnswer).length}
              </div>
              <div className="text-neutral-400 text-sm">Correct</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {Object.keys(answers).length - Object.values(answers).filter((ans, idx) => ans === round.questions[idx]?.correctAnswer).length}
              </div>
              <div className="text-neutral-400 text-sm">Wrong</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/dashboard/hackathons/${hackathonId}`)}
              className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all"
            >
              Back to Hackathon
            </button>
            {passed && (
              <button
                onClick={() => navigate(`/hackathons/${hackathonId}/rounds/${parseInt(roundId) + 1}/coding`)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                Next Round: Coding Challenge
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Test Screen
  const question = round.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / round.questions.length) * 100

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-neutral-900/50 border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">{round.name}</h1>
            <p className="text-sm text-neutral-400">Question {currentQuestion + 1} of {round.questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg font-semibold ${timeLeft < 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-neutral-800">
        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              {/* Question Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-neutral-800/50 text-neutral-300 border border-neutral-700">
                  {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold text-white mb-6">{question.question}</h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(question.id, index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[question.id] === index
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-neutral-600'
                      }`}>
                        {answers[question.id] === index && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-white">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-800">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(round.questions.length - 1, prev + 1))}
                  disabled={currentQuestion === round.questions.length - 1}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-white mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {round.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                      currentQuestion === index
                        ? 'bg-blue-600 text-white'
                        : answers[q.id] !== undefined
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-neutral-800/50 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
                  <span className="text-neutral-400">Answered: {Object.keys(answers).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-neutral-800/50 border border-neutral-700"></div>
                  <span className="text-neutral-400">Not Answered: {round.questions.length - Object.keys(answers).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

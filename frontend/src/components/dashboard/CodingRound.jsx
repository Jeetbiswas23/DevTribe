import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'

export default function CodingRound() {
  const { hackathonId, roundId } = useParams()
  const navigate = useNavigate()
  const [round, setRound] = useState(null)
  const [started, setStarted] = useState(false)
  const [currentProblem, setCurrentProblem] = useState(0)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState({})
  const [testResults, setTestResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submissions, setSubmissions] = useState({})
  const [activeTab, setActiveTab] = useState('problem') // problem, testcases, submissions

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', template: '// Write your code here\n\nfunction solution() {\n  \n}\n' },
    { value: 'python', label: 'Python', template: '# Write your code here\n\ndef solution():\n    pass\n' },
    { value: 'java', label: 'Java', template: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n' }
  ]

  useEffect(() => {
    // Load round data
    const mockRound = {
      id: roundId,
      hackathonId,
      name: "Coding Challenge",
      type: "CODING",
      duration: 60, // minutes
      totalProblems: 3,
      problems: [
        {
          id: 1,
          title: "Two Sum",
          difficulty: "Easy",
          points: 10,
          description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
          examples: [
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
              input: "nums = [3,2,4], target = 6",
              output: "[1,2]",
              explanation: ""
            }
          ],
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
          ],
          testcases: [
            { input: "[2,7,11,15], 9", output: "[0,1]", hidden: false },
            { input: "[3,2,4], 6", output: "[1,2]", hidden: false },
            { input: "[3,3], 6", output: "[0,1]", hidden: true },
            { input: "[-1,-2,-3,-4,-5], -8", output: "[2,4]", hidden: true }
          ]
        },
        {
          id: 2,
          title: "Valid Parentheses",
          difficulty: "Medium",
          points: 20,
          description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
          examples: [
            {
              input: 's = "()"',
              output: "true",
              explanation: ""
            },
            {
              input: 's = "()[]{}"',
              output: "true",
              explanation: ""
            },
            {
              input: 's = "(]"',
              output: "false",
              explanation: ""
            }
          ],
          constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
          ],
          testcases: [
            { input: '"()"', output: "true", hidden: false },
            { input: '"()[]{}"', output: "true", hidden: false },
            { input: '"(]"', output: "false", hidden: true },
            { input: '"([)]"', output: "false", hidden: true },
            { input: '"{[]}"', output: "true", hidden: true }
          ]
        },
        {
          id: 3,
          title: "Binary Tree Maximum Path Sum",
          difficulty: "Hard",
          points: 30,
          description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.`,
          examples: [
            {
              input: "root = [1,2,3]",
              output: "6",
              explanation: "The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6."
            },
            {
              input: "root = [-10,9,20,null,null,15,7]",
              output: "42",
              explanation: "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42."
            }
          ],
          constraints: [
            "The number of nodes in the tree is in the range [1, 3 * 10^4].",
            "-1000 <= Node.val <= 1000"
          ],
          testcases: [
            { input: "[1,2,3]", output: "6", hidden: false },
            { input: "[-10,9,20,null,null,15,7]", output: "42", hidden: false },
            { input: "[5,4,8,11,null,13,4,7,2,null,null,null,1]", output: "48", hidden: true },
            { input: "[-3]", output: "-3", hidden: true }
          ]
        }
      ]
    }

    setRound(mockRound)
    setTimeLeft(mockRound.duration * 60)

    // Initialize code for each problem
    const initialCode = {}
    mockRound.problems.forEach(problem => {
      initialCode[problem.id] = languageOptions[0].template
    })
    setCode(initialCode)
  }, [hackathonId, roundId])

  useEffect(() => {
    if (started && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinalSubmit()
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

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    const template = languageOptions.find(l => l.value === newLanguage)?.template || ''
    const problem = round.problems[currentProblem]
    
    // Only set template if no code exists for this problem
    if (!code[problem.id]) {
      setCode(prev => ({
        ...prev,
        [problem.id]: template
      }))
    }
  }

  const handleCodeChange = (value) => {
    const problem = round.problems[currentProblem]
    setCode(prev => ({
      ...prev,
      [problem.id]: value
    }))
  }

  const handleRunCode = () => {
    const problem = round.problems[currentProblem]
    const visibleTestcases = problem.testcases.filter(tc => !tc.hidden)
    
    // Mock test execution
    const results = visibleTestcases.map((tc, index) => ({
      testcase: index + 1,
      input: tc.input,
      expectedOutput: tc.output,
      actualOutput: tc.output, // Mock: always pass for demo
      passed: true,
      executionTime: Math.random() * 100
    }))

    setTestResults(results)
    setActiveTab('testcases')
  }

  const handleSubmit = () => {
    const problem = round.problems[currentProblem]
    
    // Mock: Run all testcases including hidden ones
    const allResults = problem.testcases.map((tc, index) => ({
      testcase: index + 1,
      input: tc.input,
      expectedOutput: tc.output,
      actualOutput: tc.output,
      passed: true,
      hidden: tc.hidden,
      executionTime: Math.random() * 100
    }))

    const passedCount = allResults.filter(r => r.passed).length
    const totalCount = allResults.length

    const submission = {
      problemId: problem.id,
      timestamp: new Date().toISOString(),
      language,
      code: code[problem.id],
      testcasesPassed: passedCount,
      totalTestcases: totalCount,
      points: passedCount === totalCount ? problem.points : 0,
      status: passedCount === totalCount ? 'Accepted' : 'Wrong Answer'
    }

    setSubmissions(prev => ({
      ...prev,
      [problem.id]: [...(prev[problem.id] || []), submission]
    }))

    setTestResults(allResults)
    setActiveTab('testcases')
  }

  const handleFinalSubmit = () => {
    // Calculate total score
    let totalScore = 0
    let totalPoints = 0

    round.problems.forEach(problem => {
      totalPoints += problem.points
      const problemSubmissions = submissions[problem.id] || []
      const acceptedSubmission = problemSubmissions.find(s => s.status === 'Accepted')
      if (acceptedSubmission) {
        totalScore += acceptedSubmission.points
      }
    })

    // Save results
    const results = {
      hackathonId,
      roundId,
      score: totalScore,
      totalPoints,
      submissions: submissions,
      timestamp: new Date().toISOString()
    }

    const existingResults = JSON.parse(localStorage.getItem('coding_results') || '[]')
    existingResults.push(results)
    localStorage.setItem('coding_results', JSON.stringify(existingResults))

    setShowResults(true)
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 border border-purple-500/30 rounded-2xl mb-4">
              <span className="text-4xl">💻</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{round.name}</h1>
            <p className="text-neutral-400">Solve coding problems to earn points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Duration</div>
              <div className="text-white font-semibold text-lg">{round.duration} minutes</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Total Problems</div>
              <div className="text-white font-semibold text-lg">{round.totalProblems}</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="text-neutral-400 text-sm mb-1">Total Points</div>
              <div className="text-white font-semibold text-lg">
                {round.problems.reduce((sum, p) => sum + p.points, 0)}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-white font-semibold">Problems</h3>
            {round.problems.map((problem, index) => (
              <div key={problem.id} className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 font-medium">{index + 1}.</span>
                    <span className="text-white font-medium">{problem.title}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <span className="text-neutral-400 text-sm">{problem.points} points</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Features
            </h3>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>✔ Live code editor with syntax highlighting</li>
              <li>✔ Multiple language support (JavaScript, Python, Java, C++)</li>
              <li>✔ Run code against visible test cases</li>
              <li>✔ Hidden test cases for final evaluation</li>
              <li>✔ Auto-judge with instant feedback</li>
              <li>✔ Real-time leaderboard</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all text-lg"
          >
            Start Coding Challenge
          </button>
        </div>
      </div>
    )
  }

  // Results Screen
  if (showResults) {
    const totalPoints = round.problems.reduce((sum, p) => sum + p.points, 0)
    let earnedPoints = 0
    
    round.problems.forEach(problem => {
      const problemSubmissions = submissions[problem.id] || []
      const accepted = problemSubmissions.find(s => s.status === 'Accepted')
      if (accepted) earnedPoints += problem.points
    })

    const percentage = ((earnedPoints / totalPoints) * 100).toFixed(2)

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-500/10 border-purple-500/30 border rounded-2xl mb-4">
              <span className="text-6xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Challenge Completed!</h1>
            <p className="text-neutral-400">Here's your performance summary</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{earnedPoints}</div>
              <div className="text-neutral-400 text-sm">Points Earned</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{totalPoints}</div>
              <div className="text-neutral-400 text-sm">Total Points</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{percentage}%</div>
              <div className="text-neutral-400 text-sm">Score</div>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Object.values(submissions).filter(subs => subs.some(s => s.status === 'Accepted')).length}
              </div>
              <div className="text-neutral-400 text-sm">Solved</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Problem Summary</h3>
            <div className="space-y-3">
              {round.problems.map((problem, index) => {
                const problemSubs = submissions[problem.id] || []
                const accepted = problemSubs.find(s => s.status === 'Accepted')
                
                return (
                  <div key={problem.id} className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400 font-medium">{index + 1}.</span>
                        <span className="text-white font-medium">{problem.title}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400 text-sm">{problemSubs.length} submission(s)</span>
                        {accepted ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium">
                            ✓ Accepted ({problem.points} pts)
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium">
                            ✗ Not Solved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => navigate(`/dashboard/hackathons/${hackathonId}`)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
          >
            Back to Hackathon
          </button>
        </div>
      </div>
    )
  }

  // Coding Screen
  const problem = round.problems[currentProblem]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-neutral-900/50 border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-white">{round.name}</h1>
          <div className="flex gap-2">
            {round.problems.map((p, index) => {
              const problemSubs = submissions[p.id] || []
              const accepted = problemSubs.some(s => s.status === 'Accepted')
              
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProblem(index)
                    setTestResults(null)
                    setActiveTab('problem')
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentProblem === index
                      ? 'bg-purple-600 text-white'
                      : accepted
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {index + 1}. {p.title}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg font-semibold ${timeLeft < 600 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
          >
            End Challenge
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-neutral-800 overflow-y-auto">
          <div className="p-6">
            {/* Problem Header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="px-3 py-1 rounded-lg text-sm font-medium bg-neutral-800/50 text-neutral-300 border border-neutral-700">
                {problem.points} points
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-neutral-300 whitespace-pre-line">{problem.description}</p>
            </div>

            {/* Examples */}
            <div className="space-y-4 mb-6">
              <h3 className="text-white font-semibold">Examples:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
                  <div className="mb-2">
                    <span className="text-neutral-400 text-sm font-medium">Input:</span>
                    <code className="block text-white font-mono text-sm mt-1">{example.input}</code>
                  </div>
                  <div className="mb-2">
                    <span className="text-neutral-400 text-sm font-medium">Output:</span>
                    <code className="block text-white font-mono text-sm mt-1">{example.output}</code>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="text-neutral-400 text-sm font-medium">Explanation:</span>
                      <p className="text-neutral-300 text-sm mt-1">{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-white font-semibold mb-3">Constraints:</h3>
              <ul className="space-y-2">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-neutral-300 text-sm">• {constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="bg-neutral-900/50 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:border-purple-500"
            >
              {languageOptions.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-all"
              >
                ▶ Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="60%"
              language={language}
              theme="vs-dark"
              value={code[problem.id] || languageOptions.find(l => l.value === language)?.template}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          {/* Bottom Panel - Tabs */}
          <div className="h-2/5 border-t border-neutral-800 flex flex-col">
            {/* Tabs */}
            <div className="bg-neutral-900/50 border-b border-neutral-800 px-4 flex gap-4">
              <button
                onClick={() => setActiveTab('problem')}
                className={`py-3 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'problem'
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => setActiveTab('testcases')}
                className={`py-3 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'testcases'
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Test Cases {testResults && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-3 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'submissions'
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Submissions {submissions[problem.id]?.length > 0 && `(${submissions[problem.id].length})`}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'problem' && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Visible Test Cases:</h4>
                  {problem.testcases.filter(tc => !tc.hidden).map((tc, index) => (
                    <div key={index} className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-3">
                      <div className="text-sm">
                        <span className="text-neutral-400">Input:</span>
                        <code className="text-white ml-2">{tc.input}</code>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="text-neutral-400">Expected:</span>
                        <code className="text-white ml-2">{tc.output}</code>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  {testResults ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium">
                          {testResults.filter(r => r.passed).length}/{testResults.length} test cases passed
                        </span>
                      </div>
                      {testResults.map((result, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-3 ${
                            result.passed
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-red-500/10 border-red-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                              {result.hidden ? '🔒 ' : ''}Test Case {result.testcase} {result.passed ? '✓' : '✗'}
                            </span>
                            <span className="text-neutral-400 text-sm">{result.executionTime.toFixed(2)}ms</span>
                          </div>
                          {!result.hidden && (
                            <>
                              <div className="text-sm mb-1">
                                <span className="text-neutral-400">Input:</span>
                                <code className="text-white ml-2">{result.input}</code>
                              </div>
                              <div className="text-sm mb-1">
                                <span className="text-neutral-400">Expected:</span>
                                <code className="text-white ml-2">{result.expectedOutput}</code>
                              </div>
                              <div className="text-sm">
                                <span className="text-neutral-400">Actual:</span>
                                <code className={`ml-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                  {result.actualOutput}
                                </code>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-neutral-400 text-center py-8">Run your code to see test results</p>
                  )}
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-3">
                  {submissions[problem.id]?.length > 0 ? (
                    submissions[problem.id].map((sub, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 ${
                          sub.status === 'Accepted'
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${sub.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                            {sub.status}
                          </span>
                          <span className="text-neutral-400 text-sm">
                            {new Date(sub.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-300">
                          <span>{sub.testcasesPassed}/{sub.totalTestcases} test cases passed</span>
                          <span className="mx-2">•</span>
                          <span>{sub.language}</span>
                          <span className="mx-2">•</span>
                          <span>{sub.points} points</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-400 text-center py-8">No submissions yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

// MCQ Round Builder Component
export function MCQRoundBuilder({ round, onUpdate }) {
  const [questions, setQuestions] = useState(round.questions || [])
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1
  })

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields')
      return
    }

    const updatedQuestions = [...questions, { ...newQuestion, id: Date.now() }]
    setQuestions(updatedQuestions)
    onUpdate({ ...round, questions: updatedQuestions })
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    })
    setShowAddQuestion(false)
  }

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId)
    setQuestions(updatedQuestions)
    onUpdate({ ...round, questions: updatedQuestions })
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options]
    updatedOptions[index] = value
    setNewQuestion({ ...newQuestion, options: updatedOptions })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">MCQ Question Pool</h3>
          <p className="text-neutral-400 text-sm">Add 10+ questions. System will randomly select 10 for participants.</p>
        </div>
        <button
          onClick={() => setShowAddQuestion(!showAddQuestion)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>
      </div>

      {/* Question Count Badge */}
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
          questions.length >= 10 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        }`}>
          {questions.length} questions added {questions.length >= 10 ? '✓' : `(${10 - questions.length} more needed)`}
        </span>
      </div>

      {/* Add Question Form */}
      {showAddQuestion && (
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Question *</label>
            <textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Enter your MCQ question..."
              className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-white font-medium">Options *</label>
            {newQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={newQuestion.correctAnswer === index}
                  onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                  className="w-5 h-5 accent-green-500"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
                />
                {newQuestion.correctAnswer === index && (
                  <span className="text-green-400 font-medium text-sm">✓ Correct</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="text-white font-medium">Marks:</label>
            <input
              type="number"
              min="1"
              value={newQuestion.marks}
              onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
              className="w-24 px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddQuestion(false)}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Add Question
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                      Q{index + 1}
                    </span>
                    <span className="text-neutral-500 text-xs">{q.marks} mark(s)</span>
                  </div>
                  <p className="text-white font-medium mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className={`px-3 py-2 rounded-lg text-sm ${
                        optIndex === q.correctAnswer
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-neutral-700/30 text-neutral-400'
                      }`}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === q.correctAnswer && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-red-400 hover:text-red-300 transition p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Coding Round Builder Component
export function CodingRoundBuilder({ round, onUpdate }) {
  const [problems, setProblems] = useState(round.problems || [])
  const [showAddProblem, setShowAddProblem] = useState(false)
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    testCases: [{ input: '', output: '', explanation: '' }],
    sampleSolution: '',
    marks: 10
  })

  const handleAddProblem = () => {
    if (!newProblem.title.trim() || !newProblem.description.trim()) {
      alert('Please fill in title and description')
      return
    }

    const updatedProblems = [...problems, { ...newProblem, id: Date.now() }]
    setProblems(updatedProblems)
    onUpdate({ ...round, problems: updatedProblems })
    setNewProblem({
      title: '',
      description: '',
      difficulty: 'Medium',
      testCases: [{ input: '', output: '', explanation: '' }],
      sampleSolution: '',
      marks: 10
    })
    setShowAddProblem(false)
  }

  const handleDeleteProblem = (problemId) => {
    const updatedProblems = problems.filter(p => p.id !== problemId)
    setProblems(updatedProblems)
    onUpdate({ ...round, problems: updatedProblems })
  }

  const handleAddTestCase = () => {
    setNewProblem({
      ...newProblem,
      testCases: [...newProblem.testCases, { input: '', output: '', explanation: '' }]
    })
  }

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...newProblem.testCases]
    updatedTestCases[index][field] = value
    setNewProblem({ ...newProblem, testCases: updatedTestCases })
  }

  const handleRemoveTestCase = (index) => {
    const updatedTestCases = newProblem.testCases.filter((_, i) => i !== index)
    setNewProblem({ ...newProblem, testCases: updatedTestCases })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Coding Problems Pool</h3>
          <p className="text-neutral-400 text-sm">Add 10+ problems. System will randomly select 3 for participants.</p>
        </div>
        <button
          onClick={() => setShowAddProblem(!showAddProblem)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Problem
        </button>
      </div>

      {/* Problem Count Badge */}
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
          problems.length >= 10 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        }`}>
          {problems.length} problems added {problems.length >= 10 ? '✓' : `(${10 - problems.length} more needed)`}
        </span>
      </div>

      {/* Add Problem Form */}
      {showAddProblem && (
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Problem Title *</label>
              <input
                type="text"
                value={newProblem.title}
                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                placeholder="e.g., Two Sum, Binary Search"
                className="w-full px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Difficulty</label>
              <select
                value={newProblem.difficulty}
                onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Problem Description *</label>
            <textarea
              value={newProblem.description}
              onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
              placeholder="Describe the problem statement..."
              className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition resize-none"
              rows={4}
            />
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-white font-medium">Test Cases *</label>
              <button
                onClick={handleAddTestCase}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
              >
                + Add Test Case
              </button>
            </div>
            <div className="space-y-3">
              {newProblem.testCases.map((testCase, index) => (
                <div key={index} className="bg-neutral-700/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm font-medium">Test Case {index + 1}</span>
                    {newProblem.testCases.length > 1 && (
                      <button
                        onClick={() => handleRemoveTestCase(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-neutral-300 text-sm mb-1">Input</label>
                    <input
                      type="text"
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                      placeholder="e.g., [2, 7, 11, 15], target = 9"
                      className="w-full px-3 py-2 bg-neutral-600/50 border border-neutral-500 rounded text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 text-sm mb-1">Expected Output</label>
                    <input
                      type="text"
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                      placeholder="e.g., [0, 1]"
                      className="w-full px-3 py-2 bg-neutral-600/50 border border-neutral-500 rounded text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 text-sm mb-1">Explanation (Optional)</label>
                    <input
                      type="text"
                      value={testCase.explanation}
                      onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                      placeholder="Brief explanation..."
                      className="w-full px-3 py-2 bg-neutral-600/50 border border-neutral-500 rounded text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Sample Solution (Optional)</label>
            <textarea
              value={newProblem.sampleSolution}
              onChange={(e) => setNewProblem({ ...newProblem, sampleSolution: e.target.value })}
              placeholder="Paste sample solution code..."
              className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition resize-none font-mono text-sm"
              rows={6}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-white font-medium">Marks:</label>
            <input
              type="number"
              min="1"
              value={newProblem.marks}
              onChange={(e) => setNewProblem({ ...newProblem, marks: parseInt(e.target.value) })}
              className="w-24 px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddProblem(false)}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProblem}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
            >
              Add Problem
            </button>
          </div>
        </div>
      )}

      {/* Problems List */}
      {problems.length > 0 && (
        <div className="space-y-3">
          {problems.map((problem, index) => (
            <div key={problem.id} className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
                      Problem {index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-neutral-500 text-xs">{problem.marks} marks</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{problem.title}</h4>
                  <p className="text-neutral-400 text-sm mb-2">{problem.description}</p>
                  <div className="text-neutral-500 text-xs">
                    {problem.testCases.length} test case(s)
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProblem(problem.id)}
                  className="text-red-400 hover:text-red-300 transition p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Project Round Builder Component  
export function ProjectRoundBuilder({ round, onUpdate }) {
  const [config, setConfig] = useState(round.config || {
    requireHostedLink: true,
    requireGithubLink: true,
    requireDescription: true,
    requireDemo: false,
    maxDescriptionLength: 500
  })

  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...config, [field]: value }
    setConfig(updatedConfig)
    onUpdate({ ...round, config: updatedConfig })
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Project Submission Configuration</h3>
        <p className="text-neutral-400 text-sm">Configure what participants need to submit for their projects.</p>
      </div>

      <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Hosted Link</div>
            <div className="text-neutral-400 text-sm">Require participants to submit a live demo link</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireHostedLink}
              onChange={(e) => handleConfigChange('requireHostedLink', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">GitHub Repository Link</div>
            <div className="text-neutral-400 text-sm">Require participants to submit source code repository</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireGithubLink}
              onChange={(e) => handleConfigChange('requireGithubLink', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Project Description</div>
            <div className="text-neutral-400 text-sm">Require participants to describe their project</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireDescription}
              onChange={(e) => handleConfigChange('requireDescription', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Demo Video</div>
            <div className="text-neutral-400 text-sm">Require participants to submit a demo video</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.requireDemo}
              onChange={(e) => handleConfigChange('requireDemo', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {config.requireDescription && (
          <div>
            <label className="block text-white font-medium mb-2">Max Description Length (characters)</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={config.maxDescriptionLength}
              onChange={(e) => handleConfigChange('maxDescriptionLength', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
        <h4 className="text-green-400 font-semibold mb-3">Submission Form Preview</h4>
        <div className="space-y-3 text-sm">
          {config.requireHostedLink && <div className="text-neutral-300">✓ Hosted Link (Required)</div>}
          {config.requireGithubLink && <div className="text-neutral-300">✓ GitHub Repository (Required)</div>}
          {config.requireDescription && <div className="text-neutral-300">✓ Project Description (Max {config.maxDescriptionLength} chars)</div>}
          {config.requireDemo && <div className="text-neutral-300">✓ Demo Video Link (Required)</div>}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hackathonAPI } from '../api'

const CreateHackathon = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    coverImage: '',
    category: 'Web Development',
    mode: 'Online',
    difficulty: 'Medium',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: 100,
    prizePool: '',
    prizes: [{ position: '1st', amount: '', description: '' }],
    rules: [''],
    techStack: [''],
    tracks: [''],
    website: '',
    discord: '',
    slack: '',
    devpost: ''
  })

  const categories = [
    'Web Development',
    'Mobile App',
    'AI/ML',
    'Blockchain',
    'IoT',
    'Game Development',
    'Cybersecurity',
    'DevOps',
    'Open Source'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handlePrizeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) =>
        i === index ? { ...prize, [field]: value } : prize
      )
    }))
  }

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: '', amount: '', description: '' }]
    }))
  }

  const removePrize = (index) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty values from arrays
      const cleanedData = {
        ...formData,
        rules: formData.rules.filter(r => r.trim()),
        techStack: formData.techStack.filter(t => t.trim()),
        tracks: formData.tracks.filter(t => t.trim()),
        prizes: formData.prizes.filter(p => p.position && p.amount)
      }

      const response = await hackathonAPI.create(cleanedData)

      alert('Hackathon created successfully!')
      navigate(`/hackathons/${response.data._id}`)
    } catch (error) {
      console.error('Error creating hackathon:', error)
      alert(error.response?.data?.error || 'Failed to create hackathon')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create Hackathon
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Hackathon Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Enter hackathon name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="A catchy tagline for your hackathon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Describe your hackathon..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mode</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Dates & Registration</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Registration Deadline *</label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Participants</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Prizes</h2>
              <button
                type="button"
                onClick={addPrize}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
              >
                + Add Prize
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Prize Pool</label>
              <input
                type="text"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="e.g., $10,000"
              />
            </div>

            {formData.prizes.map((prize, index) => (
              <div key={index} className="flex gap-4 items-start">
                <input
                  type="text"
                  value={prize.position}
                  onChange={(e) => handlePrizeChange(index, 'position', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="Position (e.g., 1st)"
                />
                <input
                  type="text"
                  value={prize.amount}
                  onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="Amount"
                />
                <input
                  type="text"
                  value={prize.description}
                  onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="Description"
                />
                {formData.prizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Rules</h2>
              <button
                type="button"
                onClick={() => addArrayItem('rules')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
              >
                + Add Rule
              </button>
            </div>

            {formData.rules.map((rule, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'rules')}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="Enter a rule"
                />
                {formData.rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'rules')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Tech Stack</h2>
              <button
                type="button"
                onClick={() => addArrayItem('techStack')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
              >
                + Add Tech
              </button>
            </div>

            {formData.techStack.map((tech, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'techStack')}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., React, Node.js"
                />
                {formData.techStack.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'techStack')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Tracks</h2>
              <button
                type="button"
                onClick={() => addArrayItem('tracks')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
              >
                + Add Track
              </button>
            </div>

            {formData.tracks.map((track, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={track}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'tracks')}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Web Development Track"
                />
                {formData.tracks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'tracks')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Links & Social</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="https://hackathon-website.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discord</label>
                <input
                  type="url"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="https://discord.gg/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slack</label>
                <input
                  type="url"
                  name="slack"
                  value={formData.slack}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="https://slack.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Devpost</label>
                <input
                  type="url"
                  name="devpost"
                  value={formData.devpost}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  placeholder="https://devpost.com/..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Hackathon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateHackathon

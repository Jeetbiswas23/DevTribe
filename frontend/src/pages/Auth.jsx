import { useNavigate } from "react-router-dom"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Auth() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState("user") // user, judge, hr
  const [currentStep, setCurrentStep] = useState(1) // 1: basic info, 2: professional info
  const [resumeFile, setResumeFile] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    skills: "",
    terms: false,
    // Professional fields for Judge/HR
    experience: "",
    company: "",
    position: "",
    linkedin: "",
    yearsOfExperience: "",
    expertise: "",
    certifications: "",
    phone: "",
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }))
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setFormData(prev => ({ ...prev, role }))
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
    } else {
      setSuccessMessage('Please upload a PDF file')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleNextStep = () => {
    // Validate basic info before going to step 2
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setSuccessMessage("Please fill in all required fields")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      return
    }
    if (!formData.terms) {
      setSuccessMessage("Please accept the terms and conditions")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      return
    }
    setCurrentStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(process.env.MONGODB_URI)

    // For login
    if (!isSignUp) {
      if (!formData.email || !formData.password) {
        setSuccessMessage("Please fill in all required fields")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        return
      }

      setLoading(true)

      const result = await login(formData.email, formData.password)

      if (result.success) {
        setSuccessMessage(`Welcome back, ${result.user.name}! 🎉`)
        setShowSuccess(true)

        setTimeout(() => {
          // Redirect based on their role
          if (result.user.userType === 'judge') {
            navigate("/dashboard/judge")
          } else if (result.user.userType === 'hr') {
            navigate("/dashboard/hr")
          } else {
            navigate("/dashboard/feed")
          }
        }, 1500)
      } else {
        setSuccessMessage(`❌ ${result.error}`)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
      setLoading(false)
      return
    }

    // For signup - validate based on step and role
    if (currentStep === 1 && (selectedRole === 'judge' || selectedRole === 'hr')) {
      handleNextStep()
      return
    }

    // Final validation for professional roles
    if (isSignUp && (selectedRole === 'judge' || selectedRole === 'hr')) {
      if (!formData.experience || !formData.company || !formData.position || !formData.phone) {
        setSuccessMessage("Please fill in all professional details")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        return
      }
      if (!resumeFile) {
        setSuccessMessage("Please upload your resume")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        return
      }
    }

    setLoading(true)

    const userData = {
      name: formData.name || formData.username || formData.email.split("@")[0],
      username: formData.username || `@${formData.email.split("@")[0]}`,
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      userType: selectedRole,
      bio: formData.bio || (selectedRole === 'judge' ? "Experienced hackathon judge" : selectedRole === 'hr' ? "HR Professional" : "Passionate developer"),
      skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : ["React", "JavaScript", "Node.js"],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
      // Professional details
      ...(selectedRole === 'judge' || selectedRole === 'hr' ? {
        experience: formData.experience,
        company: formData.company,
        position: formData.position,
        linkedin: formData.linkedin,
        yearsOfExperience: formData.yearsOfExperience,
        expertise: formData.expertise,
        certifications: formData.certifications,
        phone: formData.phone,
        resumeUploaded: true,
        resumeFileName: resumeFile?.name,
      } : {}),
    }

    const result = await register(userData)

    if (result.success) {
      setSuccessMessage(`🎉 Account created successfully! Welcome, ${result.user.name}!`)
      setShowSuccess(true)

      setTimeout(() => {
        if (selectedRole === 'judge') {
          navigate("/dashboard/judge")
        } else if (selectedRole === 'hr') {
          navigate("/dashboard/hr")
        } else {
          navigate("/dashboard/feed")
        }
      }, 1500)
    } else {
      setSuccessMessage(`❌ ${result.error}`)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden flex">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0">
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-5" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-5" />
      </div>

      <div className="relative z-10 w-64 border-r border-slate-700/50 bg-slate-950/40 backdrop-blur-xl flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-white rounded-sm flex items-center justify-center">
            <div className="w-7 h-7 bg-white" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">DevTribe</p>
            <p className="text-xs text-slate-400 mt-1">Where Developers Belong.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              {isSignUp ? "Join DevTribe" : "Welcome Back"}
            </h1>
            <p className="text-slate-400 text-center mb-8 text-sm">
              {isSignUp ? "Connect with developers worldwide" : "Sign in to your developer community"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  {/* Step Indicator for Judge/HR */}
                  {(selectedRole === 'judge' || selectedRole === 'hr') && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-blue-400' : 'text-green-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 1 ? 'border-blue-400 bg-blue-400/20' : 'border-green-400 bg-green-400/20'
                          }`}>
                          {currentStep === 1 ? '1' : '✓'}
                        </div>
                        <span className="text-sm font-medium">Basic Info</span>
                      </div>
                      <div className="w-8 h-0.5 bg-slate-700"></div>
                      <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-blue-400' : 'text-slate-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 2 ? 'border-blue-400 bg-blue-400/20' : 'border-slate-700'
                          }`}>
                          2
                        </div>
                        <span className="text-sm font-medium">Professional</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Basic Info & Role Selection */}
                  {currentStep === 1 && (
                    <>
                      {/* Role Selection */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-3">Sign up as</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => handleRoleSelect('user')}
                            className={`p-4 rounded-lg border-2 transition-all ${selectedRole === 'user'
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
                              }`}
                          >
                            <div className="text-2xl mb-1">👤</div>
                            <div className="text-white font-medium text-sm">User</div>
                            <div className="text-slate-400 text-xs mt-1">Developer</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRoleSelect('judge')}
                            className={`p-4 rounded-lg border-2 transition-all ${selectedRole === 'judge'
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
                              }`}
                          >
                            <div className="text-2xl mb-1">⚖️</div>
                            <div className="text-white font-medium text-sm">Judge</div>
                            <div className="text-slate-400 text-xs mt-1">Hackathon</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRoleSelect('hr')}
                            className={`p-4 rounded-lg border-2 transition-all ${selectedRole === 'hr'
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
                              }`}
                          >
                            <div className="text-2xl mb-1">💼</div>
                            <div className="text-white font-medium text-sm">HR</div>
                            <div className="text-slate-400 text-xs mt-1">Recruiter</div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="@johndoe"
                          required
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      {selectedRole === 'user' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Developer Role</label>
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                            >
                              <option>Developer</option>
                              <option>Designer</option>
                              <option>Product Manager</option>
                              <option>DevOps Engineer</option>
                              <option>Data Scientist</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Skills (comma separated)</label>
                            <input
                              type="text"
                              name="skills"
                              value={formData.skills}
                              onChange={handleChange}
                              placeholder="React, Node.js, Python"
                              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                          required
                          className="w-4 h-4 rounded border-slate-600 text-pink-500 focus:ring-pink-500"
                        />
                        <label className="text-sm text-slate-400">
                          I agree to the terms and conditions
                        </label>
                      </div>
                    </>
                  )}

                  {/* STEP 2: Professional Info for Judge/HR */}
                  {currentStep === 2 && (selectedRole === 'judge' || selectedRole === 'hr') && (
                    <>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 text-sm font-medium flex items-center gap-2">
                          <span>ℹ️</span>
                          <span>Professional Verification Required</span>
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          Your account will be reviewed by our team before approval
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Current Company</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Tech Corp"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Position</label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder={selectedRole === 'judge' ? "Senior Engineer" : "HR Manager"}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Years of Experience</label>
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            placeholder="5"
                            required
                            min="0"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          {selectedRole === 'judge' ? 'Areas of Expertise' : 'Specialization'}
                        </label>
                        <input
                          type="text"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleChange}
                          placeholder={selectedRole === 'judge' ? "AI/ML, Web Development" : "Technical Recruitment"}
                          required
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Professional Experience</label>
                        <textarea
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="Brief description of your professional background..."
                          required
                          rows={2}
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">LinkedIn Profile (Optional)</label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Certifications (Optional)</label>
                        <input
                          type="text"
                          name="certifications"
                          value={formData.certifications}
                          onChange={handleChange}
                          placeholder="AWS Certified, PMP, etc."
                          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                        />
                      </div>

                      {/* Resume Upload */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Upload Resume (PDF) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            required
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white cursor-pointer hover:bg-slate-900/80 transition flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              {resumeFile ? resumeFile.name : 'Choose file'}
                            </span>
                            <span className="text-slate-400 text-sm">PDF only</span>
                          </label>
                        </div>
                        {resumeFile && (
                          <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Resume uploaded successfully
                          </p>
                        )}
                      </div>

                      {/* Back Button */}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Basic Info
                      </button>
                    </>
                  )}
                </>
              )}

              {/* Login Form */}
              {!isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/80 transition"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${isSignUp && currentStep === 1 && (selectedRole === 'judge' || selectedRole === 'hr')
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
              >
                {loading ? "Processing..." :
                  isSignUp && currentStep === 1 && (selectedRole === 'judge' || selectedRole === 'hr') ? "Next: Professional Info →" :
                    isSignUp ? "Create Account" :
                      "Sign In"
                }
              </button>
            </form>

            {/* Success Notification */}
            {showSuccess && (
              <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4 animate-fade-in">
                <p className="text-green-400 text-sm font-medium text-center">{successMessage}</p>
              </div>
            )}

            {/* OAuth Options - Only show in login or step 1 */}
            {(!isSignUp || currentStep === 1) && (
              <div className="mt-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-950/80 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="border border-slate-700/50 rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-900/50 transition font-medium text-sm">
                    GitHub
                  </button>
                  <button className="border border-slate-700/50 rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-900/50 transition font-medium text-sm">
                    Google
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Sign In/Sign Up */}
            <p className="text-center text-slate-400 text-sm mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setCurrentStep(1)
                }}
                className="text-white hover:text-pink-400 transition font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

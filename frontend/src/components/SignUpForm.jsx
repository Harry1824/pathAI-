import { useState } from 'react'
import '../styles/SignUpForm.css'

function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    skills: [],
    interests: []
  })

  const [errors, setErrors] = useState({})
  const [skillInput, setSkillInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const availableInterests = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI/Machine Learning',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
    'Cybersecurity'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill'
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setSubmitted(true)
      console.log('Form Data:', formData)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          skills: [],
          interests: []
        })
      }, 3000)
    }
  }

  return (
    <div className="signup-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Join CampusPath</h1>
          <p>Create your account to get started</p>
        </div>

        {submitted && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>Account created successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 8 characters"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Skills - Multi-select with Tags */}
          <div className="form-group">
            <label htmlFor="skillInput">Skills (Add and Enter)</label>
            <div className="skill-input-wrapper">
              <input
                type="text"
                id="skillInput"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill and press Add"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="add-btn"
              >
                Add
              </button>
            </div>
            {errors.skills && <span className="error-text">{errors.skills}</span>}
            <div className="tags-container">
              {formData.skills.map((skill, index) => (
                <div key={index} className="tag">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interests - Dropdown with Multi-select */}
          <div className="form-group">
            <label>Interests (Select Multiple)</label>
            {errors.interests && <span className="error-text">{errors.interests}</span>}
            <div className="interests-grid">
              {availableInterests.map((interest) => (
                <label key={interest} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />
                  <span className="interest-label">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            <span>Create Account</span>
            <div className="btn-3d"></div>
          </button>

          {/* Sign In Link */}
          <p className="signin-link">
            Already have an account? <a href="#signin">Sign In</a>
          </p>
        </form>
      </div>

      {/* 3D Background Elements */}
      <div className="background-elements">
        <div className="cube cube-1"></div>
        <div className="cube cube-2"></div>
        <div className="cube cube-3"></div>
        <div className="sphere sphere-1"></div>
        <div className="sphere sphere-2"></div>
      </div>
    </div>
  )
}

export default SignUpForm

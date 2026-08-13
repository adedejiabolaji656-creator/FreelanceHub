import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Development',
    skillsRequired: '', budget: { type: 'fixed', min: '', max: '' },
    duration: '', experienceLevel: 'intermediate'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        budget: { ...form.budget, min: Number(form.budget.min), max: Number(form.budget.max) },
        skillsRequired: form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean)
      }
      const res = await api.post('/jobs', payload)
      navigate(`/jobs/${res.data._id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Post a New Job</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Job Title</label>
            <input type="text" className="input" required value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Description</label>
            <textarea className="input h-32" required value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Category</label>
              <select className="input" value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}>
                {['Web Development','Mobile Apps','Design','Writing','Marketing','Data Science','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Experience Level</label>
              <select className="input" value={form.experienceLevel}
                onChange={e => setForm({...form, experienceLevel: e.target.value})}>
                <option value="entry">Entry</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Skills (comma separated)</label>
            <input type="text" className="input" placeholder="React, Node.js, MongoDB"
              value={form.skillsRequired} onChange={e => setForm({...form, skillsRequired: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Budget Type</label>
              <select className="input" value={form.budget.type}
                onChange={e => setForm({...form, budget: {...form.budget, type: e.target.value}})}>
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Min ($)</label>
              <input type="number" className="input" required value={form.budget.min}
                onChange={e => setForm({...form, budget: {...form.budget, min: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Max ($)</label>
              <input type="number" className="input" required value={form.budget.max}
                onChange={e => setForm({...form, budget: {...form.budget, max: e.target.value}})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Duration</label>
            <input type="text" className="input" placeholder="e.g. 2 weeks" value={form.duration}
              onChange={e => setForm({...form, duration: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}
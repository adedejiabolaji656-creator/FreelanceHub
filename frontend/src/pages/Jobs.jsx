import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { MagnifyingGlassIcon, CurrencyDollarIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '', minBudget: '', maxBudget: '', experienceLevel: '' })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v) })
      const res = await api.get(`/jobs?${params}`)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Web Development', 'Mobile Apps', 'Design', 'Writing', 'Marketing', 'Data Science', 'Other']

  const activeFilters = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
            <BriefcaseIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            Find Work
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{jobs.length} open jobs available</p>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input type="text" placeholder="Search jobs..." className="input pl-10"
              value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
          </div>
          <select className="input lg:w-48" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input lg:w-40" value={filters.experienceLevel} onChange={e => setFilters({...filters, experienceLevel: e.target.value})}>
            <option value="">Any Level</option>
            <option value="entry">Entry</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <div className="flex gap-3">
            <input type="number" placeholder="Min $" className="input lg:w-32" value={filters.minBudget}
              onChange={e => setFilters({...filters, minBudget: e.target.value})} />
            <input type="number" placeholder="Max $" className="input lg:w-32" value={filters.maxBudget}
              onChange={e => setFilters({...filters, maxBudget: e.target.value})} />
          </div>
        </div>
        {activeFilters > 0 && (
          <button onClick={() => setFilters({ search: '', category: '', minBudget: '', maxBudget: '', experienceLevel: '' })}
            className="text-sm text-primary-600 hover:underline dark:text-primary-400">
            Clear all filters ({activeFilters})
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div></div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-20 text-gray-500 dark:text-gray-400 dark:bg-gray-800">No jobs found matching your criteria.</div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="card hover:shadow-md hover:border-primary-200 transition-all dark:hover:border-primary-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 dark:text-white">{job.title}</h3>
                    <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{job.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 dark:text-gray-400">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skillsRequired?.map(s => (
                      <span key={s} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium dark:bg-gray-700 dark:text-gray-300">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1"><CurrencyDollarIcon className="w-4 h-4 text-success" /> ${job.budget.min}-${job.budget.max} <span className="capitalize">{job.budget.type}</span></span>
                    <span className="capitalize">{job.experienceLevel} Level</span>
                    <span>{job.proposalsCount} proposals</span>
                  </div>
                </div>
                <div className="text-right ml-4 hidden sm:block shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
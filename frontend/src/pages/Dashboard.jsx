import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { BriefcaseIcon, ClipboardDocumentListIcon, StarIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ jobs: [], proposals: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      if (user?.role === 'client') {
        const res = await api.get('/jobs/my')
        setData({ jobs: res.data, proposals: [] })
      } else {
        const [jobsRes, propRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/proposals/my')
        ])
        setData({ jobs: jobsRes.data, proposals: propRes.data })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div></div>

  const statusBadge = (status) => {
    if (status === 'open') return 'bg-success/10 text-success'
    if (status === 'in-progress') return 'bg-warning/10 text-warning'
    if (status === 'completed') return 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
    if (status === 'accepted') return 'bg-success/10 text-success'
    if (status === 'rejected') return 'bg-danger/10 text-danger'
    return 'bg-warning/10 text-warning'
  }

  return (
    <div className="space-y-8">
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
          {user.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
          <p className="text-gray-500 capitalize dark:text-gray-400">{user.role} &bull; {user.email}</p>
          {user.role === 'freelancer' && (
            <div className="flex items-center gap-2 mt-1">
              <StarIcon className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium dark:text-gray-300">{user.rating || 0} ({user.totalReviews} reviews)</span>
            </div>
          )}
        </div>
      </div>

      {user.role === 'client' ? (
        <div>
          <h2 className="section-title mb-4">
            <BriefcaseIcon className="w-5 h-5" /> My Jobs
          </h2>
          {data.jobs.length === 0 ? (
            <div className="card text-center text-gray-500 py-12 dark:text-gray-400">
              <p className="mb-4">You haven't posted any jobs yet.</p>
              <Link to="/post-job" className="btn-primary">Post Your First Job</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {data.jobs.map(job => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold dark:text-gray-200">{job.title}</h3>
                      <span className={`badge mt-2 ${statusBadge(job.status)}`}>{job.status}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{job.proposalsCount} proposals</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            <h2 className="section-title mb-4">
              <ClipboardDocumentListIcon className="w-5 h-5" /> My Proposals
            </h2>
            {data.proposals.length === 0 ? (
              <div className="card text-center text-gray-500 py-12 dark:text-gray-400">
                <p className="mb-4">You haven't submitted any proposals yet.</p>
                <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {data.proposals.map(p => (
                  <div key={p._id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/jobs/${p.job._id}`} className="font-semibold hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">{p.job.title}</Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Client: {p.job.client.name}</p>
                      </div>
                      <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Proposed: ${p.proposedBudget} &bull; {p.estimatedDuration || 'No duration'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
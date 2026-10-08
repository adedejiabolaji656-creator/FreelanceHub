import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { JobDetailSkeleton } from '../components/Skeletons'
import { timeAgo } from '../utils/time'
import { CurrencyDollarIcon, ClockIcon, ChartBarIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [proposals, setProposals] = useState([])
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [proposalForm, setProposalForm] = useState({ coverLetter: '', proposedBudget: '', estimatedDuration: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      // Minimum display time so the skeleton doesn't just flicker
      const [res] = await Promise.all([api.get(`/jobs/${id}`), sleep(400)])
      setJob(res.data)
      if (user?.role === 'client' && res.data.client._id === user._id) {
        const propRes = await api.get(`/proposals/job/${id}`)
        setProposals(propRes.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const submitProposal = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/proposals', { ...proposalForm, job: id })
      setShowProposalForm(false)
      fetchJob()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit proposal')
    } finally {
      setSubmitting(false)
    }
  }

  const hireFreelancer = async (freelancerId) => {
    if (!confirm('Are you sure you want to hire this freelancer?')) return
    try {
      await api.post(`/jobs/${id}/hire`, { freelancerId })
      fetchJob()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to hire')
    }
  }

  const completeJob = async () => {
    if (!confirm('Mark this job as completed?')) return
    try {
      await api.post(`/jobs/${id}/complete`)
      fetchJob()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete')
    }
  }

  if (loading) return <JobDetailSkeleton />
  if (!job) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Job not found</div>

  const isClient = user?.role === 'client'
  const isOwner = isClient && job.client._id === user._id
  const isFreelancer = user?.role === 'freelancer'
  const canApply = isFreelancer && job.status === 'open'
  const canHire = isOwner && job.status === 'open'
  const canComplete = isOwner && job.status === 'in-progress'

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className={`badge ${job.status === 'open' ? 'bg-success/10 text-success' : job.status === 'in-progress' ? 'bg-warning/10 text-warning' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
              {job.status}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Posted {timeAgo(job.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <h1 className="text-2xl font-bold dark:text-white">{job.title}</h1>
            <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{job.category}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap mb-6 dark:text-gray-300">{job.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {job.skillsRequired?.map(s => (
              <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium dark:bg-gray-700 dark:text-gray-300">{s}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CurrencyDollarIcon className="w-5 h-5 text-success" />
              <span>${job.budget.min}-${job.budget.max} <span className="capitalize">{job.budget.type}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <ClockIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span>{job.duration || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <ChartBarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="capitalize">{job.experienceLevel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span>{job.proposalsCount} proposals</span>
            </div>
          </div>
        </div>

        {canApply && (
          <div className="card">
            {!showProposalForm ? (
              <button onClick={() => setShowProposalForm(true)} className="btn-primary w-full">Submit a Proposal</button>
            ) : (
              <form onSubmit={submitProposal} className="space-y-4">
                <h3 className="font-semibold text-lg dark:text-white">Submit Proposal</h3>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Cover Letter</label>
                  <textarea className="input h-32" value={proposalForm.coverLetter} onChange={e => setProposalForm({...proposalForm, coverLetter: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Proposed Budget ($)</label>
                    <input type="number" className="input" value={proposalForm.proposedBudget} onChange={e => setProposalForm({...proposalForm, proposedBudget: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Estimated Duration</label>
                    <input type="text" className="input" placeholder="e.g. 2 weeks" value={proposalForm.estimatedDuration} onChange={e => setProposalForm({...proposalForm, estimatedDuration: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Submitting...' : 'Submit'}</button>
                  <button type="button" onClick={() => setShowProposalForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {isOwner && proposals.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 dark:text-white">Proposals ({proposals.length})</h3>
            <div className="space-y-4">
              {proposals.map(p => (
                <div key={p._id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold dark:bg-primary-900/40 dark:text-primary-300">
                        {p.freelancer.name[0]}
                      </div>
                      <div>
                        <p className="font-medium dark:text-gray-200">{p.freelancer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{p.freelancer.title}</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">${p.proposedBudget}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3 dark:text-gray-300">{p.coverLetter}</p>
                  {canHire && p.status === 'pending' && (
                    <button onClick={() => hireFreelancer(p.freelancer._id)} className="btn-primary text-sm">Hire Freelancer</button>
                  )}
                  {p.status === 'accepted' && <span className="text-success text-sm font-medium flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> Hired</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-white">About the Client</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg dark:bg-primary-900/40 dark:text-primary-300">
              {job.client.name[0]}
            </div>
            <div>
              <p className="font-medium dark:text-gray-200">{job.client.name}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <span>⭐ {job.client.rating || 'New'}</span>
              </div>
            </div>
          </div>
        </div>

        {canComplete && (
          <div className="card">
            <h3 className="font-semibold mb-3 dark:text-white">Job Actions</h3>
            <button onClick={completeJob} className="w-full btn-primary">Mark as Completed</button>
          </div>
        )}

        {job.hiredFreelancer && (
          <div className="card">
            <h3 className="font-semibold mb-3 dark:text-white">Hired Freelancer</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center text-success font-bold">
                {job.hiredFreelancer.name[0]}
              </div>
              <p className="font-medium dark:text-gray-200">{job.hiredFreelancer.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
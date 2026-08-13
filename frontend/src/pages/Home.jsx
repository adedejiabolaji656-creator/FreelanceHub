import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BriefcaseIcon, UsersIcon, ShieldCheckIcon, CurrencyDollarIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative text-center py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent pointer-events-none rounded-3xl"></div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6 dark:bg-primary-900/40 dark:text-primary-300">
            <ShieldCheckIcon className="w-4 h-4" />
            Trusted by 10,000+ freelancers & clients
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 dark:text-white">
            Find Top Freelancers<br />for Your Next Project
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-400">
            Connect with skilled professionals worldwide. Post jobs, receive proposals, and collaborate in real-time.
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Link to={user.role === 'client' ? '/post-job' : '/jobs'} className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
                {user.role === 'client' ? 'Post a Job' : 'Find Work'}
                <ChevronRightIcon className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">Get Started</Link>
                <Link to="/jobs" className="btn-secondary text-lg px-8 py-3">Browse Jobs</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { icon: UsersIcon, title: 'Top Talent', desc: 'Access a global pool of verified freelancers across every skill set.' },
          { icon: ShieldCheckIcon, title: 'Secure Payments', desc: 'Milestone-based payments protect both clients and freelancers.' },
          { icon: CurrencyDollarIcon, title: 'Fair Pricing', desc: 'Competitive rates with transparent pricing and no hidden fees.' }
        ].map((f, i) => (
          <div key={i} className="card text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-2xl flex items-center justify-center dark:bg-primary-900/30">
              <f.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-2xl p-8 lg:p-16 text-center text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto">Join thousands of clients and freelancers already working together on FreelanceHub.</p>
        <Link to="/register" className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors shadow-md">
          Create Free Account
        </Link>
      </section>
    </div>
  )
}
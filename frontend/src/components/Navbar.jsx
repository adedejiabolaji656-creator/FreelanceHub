import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { BriefcaseIcon, ChatBubbleLeftIcon, UserCircleIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const ThemeToggle = (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
    </button>
  )

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/90 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xl">
            <BriefcaseIcon className="w-7 h-7" />
            <span>FreelanceHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-gray-600 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-400">Find Work</Link>
            {user?.role === 'client' && (
              <Link to="/post-job" className="text-gray-600 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-400">Post a Job</Link>
            )}
            {user ? (
              <>
                <Link to="/messages" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  <ChatBubbleLeftIcon className="w-6 h-6" />
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/') }} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-400">Log In</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
            {ThemeToggle}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {ThemeToggle}
            <button className="text-gray-600 dark:text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
            <Link to="/jobs" className="block text-gray-600 font-medium dark:text-gray-300">Find Work</Link>
            {user?.role === 'client' && <Link to="/post-job" className="block text-gray-600 font-medium dark:text-gray-300">Post a Job</Link>}
            {user ? (
              <>
                <Link to="/messages" className="block text-gray-600 font-medium dark:text-gray-300">Messages</Link>
                <Link to="/dashboard" className="block text-gray-600 font-medium dark:text-gray-300">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/') }} className="block text-danger font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 font-medium dark:text-gray-300">Log In</Link>
                <Link to="/register" className="block text-primary-600 font-medium dark:text-primary-400">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
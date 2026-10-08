const bar = 'rounded bg-gray-200 dark:bg-gray-700'

export function JobCardSkeleton() {
  return (
    <div className="card animate-pulse" aria-hidden="true">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-5 w-52 max-w-[60%] ${bar}`} />
            <div className={`h-5 w-24 rounded-full ${bar}`} />
          </div>
          <div className="space-y-2 mb-3">
            <div className={`h-3 w-full ${bar}`} />
            <div className={`h-3 w-4/5 ${bar}`} />
          </div>
          <div className="flex gap-2 mb-4">
            {[64, 80, 56, 72].map((w, i) => (
              <div key={i} className={`h-6 rounded-full ${bar}`} style={{ width: w }} />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className={`h-4 w-32 ${bar}`} />
            <div className={`h-4 w-20 ${bar}`} />
            <div className={`h-4 w-24 ${bar}`} />
          </div>
        </div>
        <div className={`h-3 w-14 hidden sm:block shrink-0 ${bar}`} />
      </div>
    </div>
  )
}

export function JobListSkeleton({ count = 5 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function JobDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-pulse" aria-hidden="true">
      <div className="lg:col-span-2 space-y-6">
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-6 w-16 rounded-full ${bar}`} />
            <div className={`h-4 w-20 ${bar}`} />
          </div>
          <div className={`h-7 w-3/4 ${bar}`} />
          <div className="space-y-2">
            {['100%', '100%', '92%', '100%', '66%'].map((w, i) => (
              <div key={i} className={`h-3 ${bar}`} style={{ width: w }} />
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            {[72, 88, 64].map((w, i) => (
              <div key={i} className={`h-7 rounded-full ${bar}`} style={{ width: w }} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-4 w-24 ${bar}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="card space-y-3">
          <div className={`h-5 w-36 ${bar}`} />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2 flex-1">
              <div className={`h-4 w-28 ${bar}`} />
              <div className={`h-3 w-16 ${bar}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className={`h-6 w-44 ${bar}`} />
          <div className={`h-4 w-56 ${bar}`} />
        </div>
      </div>
      <div className="space-y-4">
        <div className={`h-6 w-32 ${bar}`} />
        {[1, 2, 3].map(i => (
          <div key={i} className="card">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className={`h-4 w-64 max-w-[70vw] ${bar}`} />
                <div className={`h-5 w-16 rounded-full ${bar}`} />
              </div>
              <div className={`h-4 w-20 ${bar}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

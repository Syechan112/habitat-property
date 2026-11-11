import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-provider'
import { AlertCircle, ArrowRight, X } from 'lucide-react'

interface RoleMismatchFeedbackProps {
  targetRole?: string
  isOpen: boolean
  onClose: () => void
}

export default function RoleMismatchFeedback({
  targetRole,
  isOpen,
  onClose,
}: RoleMismatchFeedbackProps) {
  const { role } = useAuth()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate(`/${role || 'buyer'}`, { replace: true })
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, onClose, navigate, role])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-tactile-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <button
            onClick={() => {
              navigate(`/${role || 'buyer'}`, { replace: true })
              onClose()
            }}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-bold text-slate-950">Role Mismatch Detected</h3>
          <p className="text-sm text-slate-600">
            Your current role is <span className="font-semibold text-red-600">{role}</span>.
            <br />You are trying to access <span className="font-semibold text-red-600">{targetRole}</span> content.
            <br />Redirecting to your <span className="font-semibold">/{role}</span> dashboard...
          </p>

          <div className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-medium text-slate-600">
            Redirecting automatically in {countdown} seconds...
          </div>

          <button
            onClick={() => {
              navigate(`/${role || 'buyer'}`, { replace: true })
              onClose()
            }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-accent-hover shadow-tactile-sm"
          >
            <span>Go to {role} Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = 'max-w-lg',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative z-10 w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-tactile-xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              {title && (
                <h3
                  id="modal-title"
                  className="text-base sm:text-lg font-black tracking-tight text-slate-950"
                >
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-900 transition-colors shadow-tactile-xs shrink-0"
                aria-label="Tutup Dialog"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}

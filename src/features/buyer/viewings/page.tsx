import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CheckCircle2, Info, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buyerApi } from '@/services/buyer-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const inquirySchema = z.object({
  message: z.string().min(5, 'Min. 5 characters required').max(1000),
  phone: z.string().min(8, 'Valid phone number required').max(15),
  viewingDate: z.string().min(1, 'Required'),
  viewingTime: z.string().min(1, 'Required'),
})

type InquiryForm = z.infer<typeof inquirySchema>

interface ViewingPageProps {
  propertyId: number
  propertyTitle: string
}

export default function ViewingRequestPage({ propertyId, propertyTitle }: ViewingPageProps) {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema) })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: InquiryForm) => {
    setSubmitError(null); setIsSubmitting(true)
    try {
      await buyerApi.createInquiry({ propertyId, message: data.message, phone: data.phone, viewingDate: data.viewingDate, viewingTime: data.viewingTime })
      setSubmitted(true)
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-card-subtle border border-border p-8 text-center animate-float-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-light flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald" />
        </div>
        <h3 className="text-xl font-bold text-dark">Request Sent!</h3>
        <p className="mt-2 text-sm text-muted">The seller will contact you to confirm the private viewing for <span className="font-semibold text-dark">{propertyTitle}</span>.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-card-subtle rounded-3xl p-6 border border-border flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
          <Info className="h-5 w-5 text-emerald" />
        </div>
        <div>
          <p className="text-sm font-bold text-dark">Private Viewing Request</p>
          <p className="text-xs text-muted mt-1">Submit your inquiry below to schedule an inspection for <strong>{propertyTitle}</strong>.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-3xl bg-white border border-border p-6 shadow-tactile">
        {submitError && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">{submitError}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted">Message</Label>
          <textarea id="message" rows={4} placeholder="Tell us about your requirements..." {...register('message')} className="flex w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 resize-none" />
          {errors.message && <span className="text-xs text-destructive">{errors.message.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted">Phone</Label>
             <Input id="phone" type="tel" placeholder="+62..." {...register('phone')} className="rounded-2xl h-11 border-border" />
             {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
           </div>
           <div className="space-y-2">
             <Label htmlFor="viewingDate" className="text-xs font-bold uppercase tracking-wider text-muted">Date</Label>
             <div className="relative">
               <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted pointer-events-none" />
               <Input id="viewingDate" type="date" {...register('viewingDate')} className="rounded-2xl h-11 border-border pl-9" />
             </div>
             {errors.viewingDate && <span className="text-xs text-destructive">{errors.viewingDate.message}</span>}
           </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="viewingTime" className="text-xs font-bold uppercase tracking-wider text-muted">Preferred Time</Label>
          <Input id="viewingTime" type="time" {...register('viewingTime')} className="rounded-2xl h-11 w-full border-border" />
          {errors.viewingTime && <span className="text-xs text-destructive">{errors.viewingTime.message}</span>}
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-base font-semibold">
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>
    </div>
  )
}

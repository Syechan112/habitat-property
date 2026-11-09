import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buyerApi } from '@/services/buyer-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const inquirySchema = z.object({
  message: z.string().min(5, 'Pesan minimal 5 karakter').max(1000, 'Pesan terlalu panjang'),
  phone: z.string().min(8, 'Nomor telepon minimal 8 angka').max(15),
  viewingDate: z.string().min(1, 'Pilih tanggal kunjungan'),
  viewingTime: z.string().min(1, 'Pilih waktu kunjungan'),
})

type InquiryForm = z.infer<typeof inquirySchema>

interface ViewingPageProps {
  propertyId: number
  propertyTitle: string
}

export default function ViewingRequestPage({ propertyId, propertyTitle }: ViewingPageProps) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema) })

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: InquiryForm) => {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await buyerApi.createInquiry({
        propertyId,
        message: data.message,
        phone: data.phone,
        viewingDate: data.viewingDate,
        viewingTime: data.viewingTime,
      })
      setSubmitted(true)
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Inquiry gagal dikirim.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="p-10 text-center"><CardContent><Info className="h-12 w-12 mx-auto mb-4 text-accent" /><h2 className="text-xl font-semibold">Inquiry berhasil dikirim</h2><p className="mt-2 text-muted-foreground">Seller akan menghubungi Anda secepatnya untuk mengatur jadwal kunjungan.</p></CardContent></Card>
        <div className="flex gap-3"><Link className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" to="/buyer/properties">Kembali ke properti</Link><Link className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium" to="/buyer/viewings">Riwayat inquiry</Link></div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="mb-6"><CardContent className="p-0"><div className="flex items-center gap-2 rounded-md bg-muted p-2 mb-2"><Calendar className="h-5 w-5" />Viewing Request</div><p className="text-sm text-muted-foreground">Ajukan jadwal kunjungan untuk <span className="font-semibold">{propertyTitle}</span>.</p></CardContent></Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Pesan</Label>
          <Input id="message" className="min-h-[120px]" placeholder="Tuliskan pesan untuk seller..." {...register('message')} />
          {errors.message && <span className="text-sm text-destructive">{errors.message.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor telepon</Label>
          <Input id="phone" type="tel" placeholder="+62 812-3456-7890" {...register('phone')} />
          {errors.phone && <span className="text-sm text-destructive">{errors.phone.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="viewingDate">Tanggal kunjungan</Label>
          <Input id="viewingDate" type="date" {...register('viewingDate')} />
          {errors.viewingDate && <span className="text-sm text-destructive">{errors.viewingDate.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="viewingTime">Waktu kunjungan</Label>
          <Input id="viewingTime" type="time" {...register('viewingTime')} />
          {errors.viewingTime && <span className="text-sm text-destructive">{errors.viewingTime.message}</span>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Mengirim...' : 'Kirim inquiry'}</Button>
        {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      </form>
    </div>
  )
}

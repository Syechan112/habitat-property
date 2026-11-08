# PRD — HABITAT Properties

**Product:** HABITAT Properties  
**Type:** Property Discovery & Management Platform  
**Frontend:** React + TypeScript + Vite  
**Backend:** Supabase  
**Image Storage:** Cloudinary  
**Status:** MVP Development

---

## 1. Product Overview

HABITAT Properties adalah platform properti yang menghubungkan calon pembeli dengan seller melalui sistem pencarian properti, pengelolaan listing, dan manajemen inquiry.

Platform memiliki tiga role utama: Buyer, Seller, dan Admin.

**Core Objectives:**
- Mempermudah pencarian dan penemuan properti.
- Membantu seller mengelola listing dan calon pembeli.
- Menyediakan sistem administrasi dan moderasi properti.

## 2. User Roles & Features

### A. Buyer

| Feature | Description |
|---|---|
| Authentication | Register, login, logout |
| Property Discovery | Melihat katalog properti |
| Search & Filter | Pencarian berdasarkan lokasi, harga, dan tipe |
| Property Detail | Informasi lengkap properti |
| Saved Properties | Menyimpan properti favorit |
| Property Comparison | Membandingkan maksimal 3 properti |
| Inquiry | Mengirim permintaan informasi |
| WhatsApp Contact | Menghubungi seller |
| Viewing Request | Mengajukan jadwal kunjungan |
| Inquiry History | Melihat riwayat inquiry |
| Profile Management | Mengelola profil |

### B. Seller

| Feature | Description |
|---|---|
| Authentication | Register dan login |
| Seller Dashboard | Ringkasan aktivitas |
| Property Management | CRUD listing properti |
| Image Management | Upload dan mengelola gambar |
| Listing Status | Mengelola status properti |
| Lead Management | Mengelola inquiry buyer |
| Lead Status | Memperbarui status calon pembeli |
| Viewing Management | Mengelola jadwal kunjungan |
| Follow-up Reminder | Pengingat tindak lanjut |
| Listing Analytics | Statistik performa listing |

### C. Admin

| Feature | Description |
|---|---|
| Admin Authentication | Login admin |
| Admin Dashboard | Statistik keseluruhan |
| User Management | Mengelola akun pengguna |
| Seller Verification | Verifikasi seller |
| Property Approval | Approve atau reject listing |
| Property Moderation | Moderasi listing |
| Lead Monitoring | Memantau inquiry |
| Report Management | Menangani laporan |
| Activity Logs | Riwayat aktivitas |
| Platform Settings | Pengaturan platform |

## 3. Business Logic

### Authentication & Authorization
- Pengguna melakukan autentikasi melalui Supabase Auth.
- Role pengguna menentukan dashboard dan akses fitur.
- Buyer diarahkan ke `/buyer`.
- Seller diarahkan ke `/seller`.
- Admin diarahkan ke `/admin`.
- Akses data wajib dilindungi menggunakan Supabase Row Level Security (RLS).

### Property Management
- Seller dapat membuat, mengedit, dan mengarsipkan listing miliknya.
- Listing baru memiliki status `pending`.
- Admin dapat menyetujui atau menolak listing.
- Listing yang disetujui menjadi `available`.
- Buyer hanya dapat melihat listing yang sudah dipublikasikan.

### Inquiry Management
- Buyer mengirim inquiry pada properti tertentu.
- Sistem menghubungkan inquiry dengan buyer, seller, dan property.
- Seller dapat memperbarui status lead.
- Aktivitas inquiry disimpan sebagai riwayat.

### Image Management
- Validasi format dan ukuran gambar.
- Upload gambar melalui Cloudinary.
- Simpan URL dan public ID gambar di Supabase.
- Gambar yang tidak lagi digunakan harus dapat dihapus dari Cloudinary melalui mekanisme backend yang aman.

## 4. Property & Lead Status

**Property Status**

| Status | Description |
|---|---|
| Draft | Belum diajukan |
| Pending | Menunggu approval |
| Available | Tersedia |
| Reserved | Dalam proses pemesanan |
| Sold | Terjual |
| Rejected | Ditolak admin |
| Archived | Diarsipkan |

**Lead Status**

| Status | Description |
|---|---|
| New | Inquiry baru |
| Contacted | Sudah dihubungi |
| Interested | Tertarik |
| Viewing | Proses kunjungan |
| Negotiation | Negosiasi |
| Won | Berhasil |
| Lost | Tidak melanjutkan |

## 5. Technology Stack

| Technology | Purpose |
|---|---|
| React | UI Development |
| TypeScript | Type Safety |
| Vite | Development & Build |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| React Router | Routing |
| TanStack Query | Server State |
| Zustand | Client State |
| React Hook Form | Form Management |
| Zod | Validation |
| Supabase | Authentication & Database |
| Cloudinary | Image Storage |
| Lucide React | Icons |

## 6. Project Directory Structure

```text
habitat-properties/
├── public/
│
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   └── layouts/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── shared/
│   │   └── feedback/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── buyer/
│   │   │   ├── properties/
│   │   │   ├── favorites/
│   │   │   ├── inquiries/
│   │   │   └── viewings/
│   │   │
│   │   ├── seller/
│   │   │   ├── dashboard/
│   │   │   ├── properties/
│   │   │   ├── leads/
│   │   │   └── viewings/
│   │   │
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── users/
│   │       ├── approvals/
│   │       └── reports/
│   │
│   ├── hooks/
│   ├── services/
│   │   ├── supabase/
│   │   └── cloudinary/
│   │
│   ├── stores/
│   ├── config/
│   ├── schemas/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   └── main.tsx
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Architecture Rules:**
- Setiap fitur memiliki komponen, hooks, services, dan types masing-masing jika diperlukan.
- `components/ui` berisi reusable UI components.
- `config` menyimpan konfigurasi aplikasi.
- `services` menangani komunikasi dengan layanan eksternal.
- `schemas` menyimpan schema validasi Zod.
- `types` menyimpan global TypeScript types.
- Hindari duplikasi business logic.
- Hindari file dengan tanggung jawab terlalu banyak.

## 7. Environment Configuration

Buat `.env.example` sebagai template konfigurasi.

```env
# Application
VITE_APP_NAME=HABITAT Properties
VITE_APP_URL=http://localhost:5173

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

**Security Requirements:**
- `.env` wajib masuk `.gitignore`.
- `.env.example` boleh masuk repository.
- Gunakan Cloudinary unsigned upload preset dengan pembatasan format dan ukuran file, atau signed upload melalui backend.
- Jangan pernah memasukkan Supabase service role key atau Cloudinary API secret ke environment variable frontend.
- Semua akses database wajib menggunakan RLS.

## 8. UI/UX Requirements

- Modern, clean, dan premium real estate aesthetic.
- Mobile-first responsive design.
- Konsistensi typography, spacing, dan warna.
- Reusable components.
- Loading, error, empty, dan success states.
- Navigasi berbeda berdasarkan role.
- Form memiliki validasi dan feedback yang jelas.
- Dashboard menggunakan tabel, statistik, dan visualisasi yang relevan.

## 9. MVP Development Priority

| Phase | Scope |
|---|---|
| 01 | Project Setup & Architecture |
| 02 | Authentication & Role Routing |
| 03 | Buyer Property Discovery |
| 04 | Buyer Inquiry & Viewing |
| 05 | Seller Dashboard & Property CRUD |
| 06 | Cloudinary Integration |
| 07 | Seller Lead Management |
| 08 | Admin Dashboard & Approval |
| 09 | Responsive Testing & Final Audit |

## 10. Definition of Done

MVP dianggap selesai apabila:

- Ketiga role dapat login dan mengakses dashboard masing-masing.
- Buyer dapat mencari dan melihat properti.
- Buyer dapat mengirim inquiry dan viewing request.
- Seller dapat mengelola listing dan lead.
- Seller dapat mengunggah gambar.
- Admin dapat memverifikasi seller dan menyetujui listing.
- Role dan akses data terlindungi.
- Seluruh halaman responsif.
- Tidak ada critical error pada alur utama aplikasi.

---

**Project Principle:** Build a maintainable, modular, and scalable frontend. Prioritize functional business logic, reusable components, and consistent user experience over unnecessary complexity.
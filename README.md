# StudioDesk

Booking, client, and business management app for yoga/Pilates/Lagree studios — same architecture as NailDesk, backed by Supabase.

## Setup

1. `npm install`
2. `npm run dev` to run locally
3. Sign up with an email/password on first load — this creates your studio automatically
4. Add your classes under **Price list**, then share your booking link: `https://app.studiodesk.store/book/your-slug`

## Database

Supabase project: `studiodesk` (Sydney, ap-southeast-2).
Schema: `studiodesk-supabase-schema.sql` (run once) + `owner-policies.sql` (run once) — both already applied.

Tables: `studios`, `studio_hours`, `instructors`, `services`, `clients`, `appointments`, `transactions`, `stock_items`, `todos`, `booking_settings`.

## Deploy

Deployed via Vercel, connected to `app.studiodesk.store`.

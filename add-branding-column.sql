-- ═════════════════════════════════════════════════════════════
-- STUDIODESK — ADD BRANDING (LOGO) COLUMN
-- Run this once in Supabase SQL Editor → New Query → Run
-- ═════════════════════════════════════════════════════════════

ALTER TABLE studios ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Studio owners set this themselves from the Dashboard → Branding page.
-- Paste a hosted image URL (e.g. from Canva export, Imgur, or their own site).
-- If left blank, the dashboard and booking page fall back to showing the
-- studio name as a text wordmark instead of an image.

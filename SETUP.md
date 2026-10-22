# AI Care Companion

This starter is a professional, interactive demonstration surface for the AI Care Companion platform. Because no integrations or environment variables were enabled for this generation, the workspace is explicitly labeled **Demo mode**: interactions are client-side only and are not presented as persisted or connected.

## Connect the real stack

1. Connect Supabase in the project settings and add the variables from `.env.example`.
2. Apply `supabase/migrations/0001_ai_care_companion.sql` through the Supabase migration workflow.
3. Complete production RLS policies for every table before adding real patient data. Keep role authorization server-side and never trust browser-supplied roles.
4. Add an AI provider key to a server-only environment variable and implement the provider adapter behind a route handler. Keep emergency rules deterministic and clinician-reviewed; do not use an LLM as the sole triage mechanism.
5. Add a secure cron endpoint and provider-backed delivery receipts before claiming email/SMS/push reminders were delivered.

## Demo workspace

Use the Patient view and Doctor view toggles in the interactive workspace to exercise care plan, symptom check-in, appointment slot selection, patient review, and AI assistant flows. The assistant response clearly states that the live provider is not configured.

## Deployment checklist

- Set production environment variables in Vercel.
- Run migrations and verify RLS with separate patient, verified doctor, unverified doctor, and admin accounts.
- Configure email verification, password reset redirect URLs, and rate limits.
- Review synthetic seed data only; never commit credentials or real patient data.
- Complete privacy, consent, retention, threat modeling, accessibility, and clinical validation reviews before real-world use. This project does not claim regulatory compliance.

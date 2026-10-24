'use client'

import { FormEvent, useState } from 'react'
import { HeartPulse, Loader2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [register, setRegister] = useState(false)
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true); setStatus('')
    const supabase = createClient()
    if (register) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`, data: { full_name: fullName, requested_role: role } } })
      if (error) setStatus(error.message.toLowerCase().includes('password') ? error.message : 'Unable to create the account. Check your details and try again.')
      else setStatus(data.session ? 'Account created. Redirecting…' : 'Account created. Check your email to confirm your address before signing in.')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setStatus(error.message.toLowerCase().includes('confirm') ? 'Please confirm your email before signing in.' : 'Invalid email or password.')
      else if (data.user) router.push('/patient/dashboard')
    }
    setPending(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f6f9fa] px-5 py-10 text-slate-900"><div className="w-full max-w-md"><a href="/" className="mx-auto flex w-fit items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20"><HeartPulse /></span><span className="font-bold tracking-tight">AI Care Companion</span></a><section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9"><div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => { setRegister(false); setStatus('') }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${!register ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}>Sign in</button><button type="button" onClick={() => { setRegister(true); setStatus('') }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${register ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}>Register</button></div><h1 className="mt-8 text-2xl font-bold">{register ? 'Create your account' : 'Welcome back'}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{register ? 'Create a secure workspace for your connected care journey.' : 'Sign in to continue to your private care workspace.'}</p><form className="mt-7 flex flex-col gap-4" onSubmit={submit}>{register && <><label className="flex flex-col gap-2 text-sm font-semibold">Account type<select value={role} onChange={e => setRole(e.target.value as 'patient' | 'doctor')} className="h-11 rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500"><option value="patient">Patient</option><option value="doctor">Doctor</option></select></label><label className="flex flex-col gap-2 text-sm font-semibold">Full name<input value={fullName} onChange={e => setFullName(e.target.value)} required className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500" /></label></>}<label className="flex flex-col gap-2 text-sm font-semibold">Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={6} placeholder="Enter your password" required className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500" /></label><button type="submit" disabled={pending} className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 font-semibold text-white hover:bg-teal-700 disabled:opacity-60">{pending && <Loader2 className="size-4 animate-spin" />}{register ? 'Create account' : 'Sign in'}</button></form>{status && <p role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{status}</p>}{!register && <button type="button" onClick={async () => { if (!email) { setStatus('Enter your email first.'); return }; const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback` }); setStatus(error ? 'Unable to send a reset email right now.' : 'Password reset instructions sent if that email is registered.') }} className="mt-5 block w-full text-center text-sm font-medium text-teal-700">Forgot password?</button>}<div className="mt-7 flex gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-xs leading-5 text-teal-800"><ShieldCheck className="mt-0.5 shrink-0" /> Your credentials are handled by Supabase Auth. Doctor accounts require administrator verification before accessing patient records.</div></section><p className="mt-6 text-center text-xs text-slate-400"><a href="/" className="hover:text-teal-700">Return home</a></p></div></main>
}

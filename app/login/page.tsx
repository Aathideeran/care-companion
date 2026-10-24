'use client'

import { useState } from 'react'
import { HeartPulse, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [register, setRegister] = useState(false)
  const [role, setRole] = useState<'Patient' | 'Doctor'>('Patient')

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f9fa] px-5 py-10 text-slate-900">
      <div className="w-full max-w-md">
        <a href="/" className="mx-auto flex w-fit items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20"><HeartPulse /></span><span className="font-bold tracking-tight">AI Care Companion</span></a>
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
          <div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setRegister(false)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${!register ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}>Sign in</button><button type="button" onClick={() => setRegister(true)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${register ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}>Register</button></div>
          <h1 className="mt-8 text-2xl font-bold">{register ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{register ? 'Choose how you will use your connected care workspace.' : 'Sign in to continue to your private care workspace.'}</p>
          <form className="mt-7 flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
            {register && <><label className="flex flex-col gap-2 text-sm font-semibold">Account type<select value={role} onChange={(event) => setRole(event.target.value as 'Patient' | 'Doctor')} className="h-11 rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500"><option>Patient</option><option>Doctor</option></select></label><label className="flex flex-col gap-2 text-sm font-semibold">Full name<input required className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500" /></label></>}
            <label className="flex flex-col gap-2 text-sm font-semibold">Email<input type="email" placeholder="you@example.com" required className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500" /></label>
            <label className="flex flex-col gap-2 text-sm font-semibold">Password<input type="password" placeholder="Enter your password" required className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:ring-2 focus:ring-teal-500" /></label>
            <Button type="submit" disabled className="mt-2 h-11 rounded-xl bg-teal-600 hover:bg-teal-700">{register ? 'Create account' : 'Sign in'}</Button>
          </form>
          {!register && <a href="#forgot-password" className="mt-5 block text-center text-sm font-medium text-teal-700">Forgot password?</a>}
          <div className="mt-7 flex gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-xs leading-5 text-teal-800"><ShieldCheck className="mt-0.5 shrink-0" /> Authentication is unavailable until Supabase is connected to this project. No account or credential has been prefilled.</div>
        </section>
        <p className="mt-6 text-center text-xs text-slate-400"><a href="/" className="hover:text-teal-700">Return home</a></p>
      </div>
    </main>
  )
}

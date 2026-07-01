import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useRegister } from '../hooks/useAuth'
import { WebGLDotBackground } from "@/components/ui/webgl-dot-background"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import lottieLogoUrl from '../../../assets/prepVectorLogo.lottie?url';

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { mutate: registerUser, isPending, isError } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerUser(
      { username, email, password },
      {
        onSuccess: () => navigate('/'),
      }
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black p-4 text-zinc-200">
      <WebGLDotBackground />
      <div className="w-full max-w-sm relative z-10 bg-[#121214]/70 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/10">
        
        {/* Corner Crosshairs */}
        <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -top-[8px] -left-[8px] text-emerald-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>
        <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -top-[8px] -right-[8px] text-emerald-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>
        <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -bottom-[8px] -left-[8px] text-emerald-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>
        <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -bottom-[8px] -right-[8px] text-emerald-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>

        <div className="mb-10 flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 flex items-center justify-center mb-2">
            <DotLottieReact
              src={lottieLogoUrl}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Create an account</h1>
          <p className="text-sm text-zinc-400">Enter your details to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-zinc-300">
              Username
            </label>
            <input 
              type="text" 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe" 
              required
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              required
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          <Button disabled={isPending} type="submit" className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-600 h-11 rounded-xl font-medium transition-colors mt-2 shadow-md">
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          {isError && <p className="text-sm text-red-500 text-center mt-2 font-medium">Registration failed. Please try again.</p>}
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SignUp
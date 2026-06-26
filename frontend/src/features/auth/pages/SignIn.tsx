import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useLogin } from '../hooks/useAuth'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { mutate: login, isPending, isError } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: () => navigate('/'),
      }
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500">Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                Forgot password?
              </a>
            </div>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          
          <Button disabled={isPending} type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-11 rounded-lg font-medium transition-colors mt-2">
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>
          {isError && <p className="text-sm text-red-500 text-center mt-2">Invalid email or password.</p>}
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/sign-up" className="font-medium text-zinc-900 hover:underline transition-all">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SignIn
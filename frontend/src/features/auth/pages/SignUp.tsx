import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useRegister } from '../hooks/useAuth'

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
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Create an account</h1>
          <p className="text-sm text-zinc-500">Enter your details to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-zinc-700">
              Username
            </label>
            <input 
              type="text" 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe" 
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Password
            </label>
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
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          {isError && <p className="text-sm text-red-500 text-center mt-2">Registration failed. Please try again.</p>}
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-zinc-900 hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SignUp
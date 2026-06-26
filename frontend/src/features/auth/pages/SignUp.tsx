import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

const SignUp = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Create an account</h1>
          <p className="text-sm text-zinc-500">Enter your details to get started</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-zinc-700">
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              placeholder="johndoe" 
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
              placeholder="name@example.com" 
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
              placeholder="••••••••" 
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          
          <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-11 rounded-lg font-medium transition-colors mt-2">
            Sign Up
          </Button>
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
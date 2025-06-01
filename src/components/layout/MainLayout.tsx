"use client"

import type React from "react"

// src/components/layout/DashboardLayout.tsx
import Sidebar from "./Sidebar"
import Header from "./Header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

interface Props {
  children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  )
}

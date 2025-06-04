"use client"

import type { ReactElement } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"
import { useModulePermissions } from "@/context/PermissionContext"
import Loader from "../loader"
import PermissionError from "../permission/permission-error"
import PermissionDenied from "../permission/permission-denied"

interface Props {
  module?: string
  children: ReactElement<any>
}

export default function MainLayout({ module, children }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  const {
    permissions: modulePermission,
    loading: permissionLoading,
    error: permissionError,
    hasAccess,
    canAdd,
    canEdit,
    canDelete,
    canExport,
    canVoid,
  } = useModulePermissions(module ?? "")

  let content = children

  if (module) {
    if (permissionLoading) {
      content = <Loader />
    } else if (permissionError) {
      content = <PermissionError permissionError={permissionError} />
    } else if (!hasAccess) {
      content = <PermissionDenied />
    } else {
      content = React.cloneElement(children, {
        modulePermission,
        canAdd,
        canEdit,
        canDelete,
        canExport,
        canVoid,
      })
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            {content}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}
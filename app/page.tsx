"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"

export default function Home() {
    // <div className="m-4">Jautājumi pie Ritvara drauga...</div>

    
//   useEffect(() => {
//     // window.location.href = 'https://r1riepas.lv/';
//   }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
function redirectWithMessage() {
    setTimeout(() => {
        window.location.href = 'https://r1riepas.lv/';
      }, 2000);
    
    return (
        <div className="m-4">Jautājumi pie Ritvara drauga...</div>
    )
}
     
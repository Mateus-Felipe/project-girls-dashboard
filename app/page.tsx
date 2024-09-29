'use client'
import { useEffect } from "react";
import { checkAuthInClient } from "./services/checkAuthInClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    var auth = checkAuthInClient('athtk');
    if (!auth) {
      router.push('login')
    }
    router.push('/dashboard')
  }, [])
  return (
    <div>

    </div>
  );
}
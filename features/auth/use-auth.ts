"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError("Email o contraseña incorrectos.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setIsLoading(false);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return { signIn, signOut, isLoading, error };
}

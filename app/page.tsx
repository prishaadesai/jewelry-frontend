// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      const user = getCurrentUser();
      if (user?.role === "owner") {
        router.push("/dashboard");
      } else {
        router.push("/worker/tasks");
      }
    }
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <p>Redirecting...</p>
    </div>
  );
}

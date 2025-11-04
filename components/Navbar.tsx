// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          Jewelry Management
        </Link>

        {user.role === "owner" ? (
          <>
            <Link
              href="/dashboard"
              style={{ color: "white", textDecoration: "none" }}
            >
              Dashboard
            </Link>
            <Link
              href="/jobs"
              style={{ color: "white", textDecoration: "none" }}
            >
              Jobs
            </Link>
            <Link
              href="/users"
              style={{ color: "white", textDecoration: "none" }}
            >
              Users
            </Link>
            <Link
              href="/reports"
              style={{ color: "white", textDecoration: "none" }}
            >
              Reports
            </Link>
          </>
        ) : (
          <Link
            href="/worker/tasks"
            style={{ color: "white", textDecoration: "none" }}
          >
            My Tasks
          </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span>
          {user.full_name} ({user.role})
        </span>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

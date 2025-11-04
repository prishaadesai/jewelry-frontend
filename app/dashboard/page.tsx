// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { JobSummary } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<JobSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "owner") {
      router.push("/login");
      return;
    }
    fetchSummary();
  }, [router]);

  const fetchSummary = async () => {
    try {
      const response = await api.get("/api/reports/job-summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>

        {summary && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>Total Jobs</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.total_jobs}
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#c8e6c9",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>Completed</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.completed_jobs}
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#fff9c4",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>In Progress</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.in_progress_jobs}
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffccbc",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>Pending</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.pending_jobs}
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#f3e5f5",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>Total Initial Weight</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.total_initial_weight.toFixed(3)}g
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>Total Loss</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.total_loss.toFixed(3)}g
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#fce4ec",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: 0 }}>Avg Loss %</h3>
              <p
                style={{
                  fontSize: "2rem",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "bold",
                }}
              >
                {summary.average_loss_percentage}%
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

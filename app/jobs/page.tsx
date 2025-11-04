// app/jobs/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { Job } from "@/lib/types";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "owner") {
      router.push("/login");
      return;
    }
    fetchJobs();
  }, [router, filter]);

  const fetchJobs = async () => {
    try {
      const url = filter ? `/api/jobs?status=${filter}` : "/api/jobs";
      const response = await api.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1>Jobs</h1>
          <Link
            href="/jobs/create"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Create New Job
          </Link>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "0.5rem" }}>Filter by status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All</option>
            <option value="created">Created</option>
            <option value="in_progress">In Progress</option>
            <option value="pending_assignment">Pending Assignment</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Design No
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Initial Weight
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Total Loss
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Loss %
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "1rem" }}>{job.design_no}</td>
                  <td style={{ padding: "1rem" }}>{job.item_category}</td>
                  <td style={{ padding: "1rem" }}>
                    {job.initial_weight.toFixed(3)}g
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {job.total_loss.toFixed(3)}g
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {job.loss_percentage.toFixed(2)}%
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor:
                          job.status === "completed"
                            ? "#28a745"
                            : job.status === "in_progress"
                            ? "#ffc107"
                            : "#6c757d",
                        color: "white",
                        fontSize: "0.875rem",
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <Link
                      href={`/jobs/${job.id}`}
                      style={{ color: "#007bff", marginRight: "1rem" }}
                    >
                      View
                    </Link>
                    <Link
                      href={`/jobs/${job.id}/assign`}
                      style={{ color: "#28a745" }}
                    >
                      Assign
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && jobs.length === 0 && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
            No jobs found
          </p>
        )}
      </div>
    </>
  );
}

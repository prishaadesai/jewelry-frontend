// app/jobs/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { JobDetail } from "@/lib/types";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchJobDetail();
    }
  }, [params.id]);

  const fetchJobDetail = async () => {
    try {
      const response = await api.get(`/api/jobs/${params.id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
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

  if (!job) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Job not found
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <h1>Job Details: {job.design_no}</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div>
              <strong>Category:</strong> {job.item_category}
            </div>
            <div>
              <strong>Initial Weight:</strong> {job.initial_weight.toFixed(3)}g
            </div>
            <div>
              <strong>Total Loss:</strong> {job.total_loss.toFixed(3)}g
            </div>
            <div>
              <strong>Loss Percentage:</strong> {job.loss_percentage.toFixed(2)}
              %
            </div>
            <div>
              <strong>Status:</strong> {job.status}
            </div>
            <div>
              <strong>Current Stage:</strong> {job.current_stage || "N/A"}
            </div>
          </div>

          {job.description && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Description:</strong>
              <p>{job.description}</p>
            </div>
          )}
        </div>

        <h2>Transaction History</h2>
        {job.transactions && job.transactions.length > 0 ? (
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
                  Stage
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Issued Weight
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Returned Weight
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Loss
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
                  Issued At
                </th>
              </tr>
            </thead>
            <tbody>
              {job.transactions.map((trans) => (
                <tr
                  key={trans.id}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td style={{ padding: "1rem" }}>{trans.stage}</td>
                  <td style={{ padding: "1rem" }}>
                    {trans.issued_weight.toFixed(3)}g
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {trans.returned_weight
                      ? `${trans.returned_weight.toFixed(3)}g`
                      : "-"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {trans.loss ? `${trans.loss.toFixed(3)}g` : "-"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {trans.loss_percentage
                      ? `${trans.loss_percentage.toFixed(2)}%`
                      : "-"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor:
                          trans.status === "completed" ? "#28a745" : "#ffc107",
                        color: "white",
                        fontSize: "0.875rem",
                      }}
                    >
                      {trans.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {new Date(trans.issued_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p
            style={{
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            No transactions yet
          </p>
        )}
      </div>
    </>
  );
}

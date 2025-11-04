// app/jobs/[id]/assign/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { User, Job } from "@/lib/types";

export default function AssignJobPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [workers, setWorkers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    worker_id: "",
    stage: "",
    issued_weight: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJob();
    fetchWorkers();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${params.id}`);
      setJob(response.data);
      setFormData((prev) => ({
        ...prev,
        issued_weight: response.data.initial_weight.toString(),
      }));
    } catch (error) {
      console.error("Failed to fetch job:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/api/users");
      setWorkers(response.data.filter((u: User) => u.role !== "owner"));
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post(`/api/jobs/${params.id}/assign`, {
        worker_id: parseInt(formData.worker_id),
        stage: formData.stage,
        issued_weight: parseFloat(formData.issued_weight),
      });
      router.push(`/jobs/${params.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to assign job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Assign Job: {job?.design_no}</h1>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Select Worker *
            </label>
            <select
              value={formData.worker_id}
              onChange={(e) =>
                setFormData({ ...formData, worker_id: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">-- Select Worker --</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.full_name} ({worker.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Production Stage *
            </label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">-- Select Stage --</option>
              <option value="casting">Casting</option>
              <option value="filing">Filing</option>
              <option value="setting">Setting</option>
              <option value="polishing">Polishing</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Issued Weight (grams) *
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.issued_weight}
              onChange={(e) =>
                setFormData({ ...formData, issued_weight: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.75rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Assigning..." : "Assign Job"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: "0.75rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

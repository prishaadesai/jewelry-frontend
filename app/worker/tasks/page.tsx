// app/worker/tasks/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { WorkerTask } from "@/lib/types";

export default function WorkerTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);
  const [returnedWeight, setReturnedWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role === "owner") {
      router.push("/login");
      return;
    }
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/worker/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/worker/complete-task", {
        transaction_id: selectedTask?.transaction_id,
        returned_weight: parseFloat(returnedWeight),
        notes: notes || undefined,
      });
      setSelectedTask(null);
      setReturnedWeight("");
      setNotes("");
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to complete task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>My Tasks</h1>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            <p>No tasks assigned to you currently</p>
          </div>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                marginBottom: "2rem",
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
                    Issued Date
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
                {tasks.map((task) => (
                  <tr
                    key={task.transaction_id}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "1rem" }}>{task.design_no}</td>
                    <td style={{ padding: "1rem" }}>{task.item_category}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: "#17a2b8",
                          color: "white",
                          fontSize: "0.875rem",
                        }}
                      >
                        {task.stage}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {task.issued_weight.toFixed(3)}g
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {new Date(task.issued_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setReturnedWeight(task.issued_weight.toString());
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Complete Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedTask && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h2>
                  Complete Task: {selectedTask.design_no} - {selectedTask.stage}
                </h2>

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

                <form onSubmit={handleCompleteTask}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                      <strong>Issued Weight:</strong>{" "}
                      {selectedTask.issued_weight.toFixed(3)}g
                    </label>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                      Returned Weight (grams) *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={returnedWeight}
                      onChange={(e) => setReturnedWeight(e.target.value)}
                      required
                      max={selectedTask.issued_weight}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                    <small style={{ color: "#6c757d" }}>
                      Loss:{" "}
                      {(
                        selectedTask.issued_weight -
                        parseFloat(returnedWeight || "0")
                      ).toFixed(3)}
                      g
                    </small>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
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
                      disabled={submitting}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: submitting ? "not-allowed" : "pointer",
                        opacity: submitting ? 0.6 : 1,
                      }}
                    >
                      {submitting ? "Submitting..." : "Complete Task"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTask(null);
                        setReturnedWeight("");
                        setNotes("");
                        setError("");
                      }}
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
            )}
          </>
        )}
      </div>
    </>
  );
}

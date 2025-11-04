// app/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { WorkerPerformance, MaterialConsumption } from "@/lib/types";

export default function ReportsPage() {
  const router = useRouter();
  const [workerPerformance, setWorkerPerformance] = useState<
    WorkerPerformance[]
  >([]);
  const [materialConsumption, setMaterialConsumption] = useState<
    MaterialConsumption[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "owner") {
      router.push("/login");
      return;
    }
    fetchReports();
  }, [router]);

  const fetchReports = async () => {
    try {
      const [perfResponse, matResponse] = await Promise.all([
        api.get("/api/reports/worker-performance"),
        api.get("/api/reports/material-consumption"),
      ]);
      setWorkerPerformance(perfResponse.data);
      setMaterialConsumption(matResponse.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
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
        <h1>Reports & Analytics</h1>

        <div style={{ marginTop: "2rem" }}>
          <h2>Worker Performance</h2>
          {workerPerformance.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                marginTop: "1rem",
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
                    Worker Name
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Total Jobs
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
                    Avg Loss %
                  </th>
                </tr>
              </thead>
              <tbody>
                {workerPerformance.map((worker) => (
                  <tr
                    key={worker.worker_id}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "1rem" }}>{worker.worker_name}</td>
                    <td style={{ padding: "1rem" }}>{worker.role}</td>
                    <td style={{ padding: "1rem" }}>{worker.total_jobs}</td>
                    <td style={{ padding: "1rem" }}>
                      {worker.total_loss.toFixed(3)}g
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {worker.average_loss_percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p
              style={{
                padding: "1rem",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              No worker performance data available
            </p>
          )}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <h2>Material Consumption by Category</h2>
          {materialConsumption.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                marginTop: "1rem",
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
                    Category
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Total Jobs
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
                </tr>
              </thead>
              <tbody>
                {materialConsumption.map((category) => (
                  <tr
                    key={category.item_category}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "1rem" }}>
                      {category.item_category}
                    </td>
                    <td style={{ padding: "1rem" }}>{category.total_jobs}</td>
                    <td style={{ padding: "1rem" }}>
                      {category.total_initial_weight.toFixed(3)}g
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {category.total_loss.toFixed(3)}g
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {category.loss_percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p
              style={{
                padding: "1rem",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              No material consumption data available
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// app/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/lib/types";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "owner") {
      router.push("/login");
      return;
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
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
          <h1>Users</h1>
          <Link
            href="/users/create"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Add New User
          </Link>
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
                  Username
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Full Name
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Email
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
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "1rem" }}>{user.username}</td>
                  <td style={{ padding: "1rem" }}>{user.full_name}</td>
                  <td style={{ padding: "1rem" }}>{user.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor:
                          user.role === "owner" ? "#dc3545" : "#17a2b8",
                        color: "white",
                        fontSize: "0.875rem",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor: user.is_active ? "#28a745" : "#6c757d",
                        color: "white",
                        fontSize: "0.875rem",
                      }}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/useAuth";

export default function AdminHome() {
  const { role, name, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // fetch users only if role is admin
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users");
        setUsers(response.data.data);
      } catch {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Welcome to the Protected Admin Home Page!
      </h1>
      <p className="mt-2">You are successfully logged in.</p>
      <p className="my-2">
        Your role: <strong>{role || ""}</strong>
        <br />
        Your Name: <strong>{name || ""}</strong>
      </p>
      <p>
        This is the admin home page. Only users with the 'admin' role can access
        this page.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={logout}
      >
        Logout
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">User List</h2>
        {error && <div className="text-red-500">{error}</div>}
        <ul>
          {(Array.isArray(users) ? users : []).map((user: any) => (
            <li key={user.id}>
              {user.username} ({user.role}) - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

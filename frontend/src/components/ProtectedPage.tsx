import { useAuth } from "@/context/useAuth";

export default function Protected() {
  const { logout, role } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p>
        You have accessed a protected route but do not have a specific
        role-based
      </p>
      <div>
        <p className="text-red-600">
          No route available for {role} role yet. Please contact the administrator.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

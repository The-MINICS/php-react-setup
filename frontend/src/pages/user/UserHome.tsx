import { useAuth } from "@/context/useAuth";

export default function UserHome() {
  const { role, name, logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to the User Home Page!</h1>
      <p className="mt-2">You are successfully logged in.</p>
      <p className="my-2">
        Your role: <strong>{role}</strong>
        <br />
        Your Name: <strong>{name}</strong>
        <br />
        <p>
          This is the admin home page. Only users with the 'admin' role can
          access this page.
        </p>
      </p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

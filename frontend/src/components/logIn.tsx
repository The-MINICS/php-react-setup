import { useAuth } from "@/context/useAuth";
import type { LoginResponse } from "@/types/logInResponse";
import axios from "axios";
import { useActionState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/axiosInstance";

async function handleLoginAction(
  _previousState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return { success: false, message: "Invalid form data." };
  }

  try {
    const response = await axiosInstance.post("/api/auth/login", {
      username,
      password,
    });
    const { name, token } = response.data.data;
    if (name && token) {
      localStorage.setItem("authToken", token);

      // Decode the token to extract the role
      const decodedToken: { role: string } = jwtDecode(token);

      return {
        success: true,
        message: "Login successful!",
        role: decodedToken.role,
        name: name,
      };
    } else {
      return {
        success: false,
        message: "Invalid response from server.",
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      return {
        success: false,
        message: "Login failed.",
      };
    }
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export default function Login() {
  const [state, submitAction, isPending] = useActionState<
    LoginResponse,
    FormData
  >(handleLoginAction, {
    success: false,
    message: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.success && state.role && state.name) {
      login(state.role, state.name);
      navigate({ pathname: state.role ? `/${state.role}` : "/protected" });
    }
  }, [state.success, state.role, state.name, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Welcome Back! Please Log In
        </h2>
        <p className="mb-4 text-center text-gray-600">
          Enter your credentials to access your account.
        </p>
        <form action={submitAction} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-blue-800 text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              className="w-full px-3 py-2 border border-blue-800 text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
            />
          </div>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Register here
            </a>
            .
          </p>
          {state.message &&
            (state.success ? (
              <p className="text-green-600 font-medium">{state.message}</p>
            ) : (
              <p className="text-red-600 font-medium">{state.message}</p>
            ))}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition cursor-pointer"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

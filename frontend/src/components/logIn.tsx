import { useAuth } from "@/context/useAuth";
import type { LoginResponse } from "@/types/logInResponse";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

async function handleLoginAction(
  _previousState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  const username = formData.get("username");
  const password = formData.get("password");
  console.log("Form Data:", { username, password });

  if (typeof username !== "string" || typeof password !== "string") {
    return { success: false, message: "Invalid form data." };
  }

  try {
    const response = await axiosInstance.post("/api/auth/login", {
      username,
      password,
    });
    const { success, message, name, token } = response.data;
    if (success && name && token) {
      localStorage.setItem("authToken", token);

      // Decode the token to extract the role
      const decodedToken: { role: string } = jwtDecode(token);

      return {
        success: true,
        message: "Login successful!",
        role: decodedToken.role,
      };
    } else {
      return {
        success: false,
        message: message || "Invalid response from server.",
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Login failed.",
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

  if (state.success && state.role) {
    login(state.role);
    navigate({ pathname: "/" });
  }

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
          {state.message && (
            <div className="flex items-center gap-2 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              {state.message}
            </div>
          )}
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

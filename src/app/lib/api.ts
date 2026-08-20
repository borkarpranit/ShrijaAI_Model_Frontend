// src/app/lib/api.ts

// Backend runs on port 8080 by default (see AuthController)
const API_BASE = "http://localhost:8080/api/auth";

export interface LoginResult {
  userId: number;
  username: string;
  role: "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";
  message: string;
  token: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Invalid email or password");
  }

  return response.json();
}

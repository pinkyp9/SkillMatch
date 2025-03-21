"use client";
import { useEffect, useState } from "react";

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("candidate");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data?.email) {
        setEmail(data.email);
      }
    };
    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("User created successfully!");
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create User Profile</h2>
      {email ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
        </form>
      ) : (
        <p>Loading session...</p>
      )}

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

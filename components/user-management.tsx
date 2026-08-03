"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Users, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
    role: "Staff",
  });
  const [userFormError, setUserFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("[v0] Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      if (res.ok) {
        await fetchUsers();
        setShowUserModal(false);
        setUserFormData({ username: "", password: "", role: "Staff" });
        toast({
          variant: "default",
          className: "bg-green-600 text-white border-green-600",
          title: "Success",
          description: "User created successfully",
        });
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to create user");
      }
    } catch (error) {
      console.error("[v0] Error creating user:", error);
      setUserFormError(
        error instanceof Error ? error.message : "Failed to create user",
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create user",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchUsers();
        toast({
          variant: "default",
          className: "bg-green-600 text-white border-green-600",
          title: "Success",
          description: "User deleted successfully",
        });
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("[v0] Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete user",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">User Management</h2>
        <button
          onClick={() => setShowUserModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="hospital-card p-6 border-2 border-blue-200">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-200">
                  <th className="text-left px-4 py-3 text-blue-900 font-bold">
                    Username
                  </th>
                  <th className="text-left px-4 py-3 text-blue-900 font-bold">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-blue-900 font-bold">
                    Created At
                  </th>
                  <th className="text-left px-4 py-3 text-blue-900 font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-blue-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-blue-900 font-semibold">
                      {user.username}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-900">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Creation Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="hospital-card border border-slate-200 p-8 rounded-[28px] max-w-md w-full relative bg-white/95 shadow-2xl">
            <button
              onClick={() => {
                setShowUserModal(false);
                setUserFormData({ username: "", password: "", role: "Staff" });
                setUserFormError("");
              }}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Create New User
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {userFormError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {userFormError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userFormData.username}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Role
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

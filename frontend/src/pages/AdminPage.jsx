import React, { useCallback, useEffect, useState } from "react";
import { Shield, ShieldAlert, UserX, UserPlus, Mail, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { useToast } from "../context/ToastContext";
import { userService } from "../services/userService";

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const loadUsers = useCallback(async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error(err.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const createdUser = await userService.createUser({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        role: e.target.role.value,
      });

      setUsers((prev) => [...prev, createdUser]);
      setAddUserModalOpen(false);
      e.target.reset();
      toast.success("User added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAccessLevel = (userId, newLevel) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => (
        user.id === userId ? { ...user, defaultAccessLevel: newLevel } : user
      ))
    );
    toast.info("Updated default file access in the UI.");
  };

  const toggleRole = async (userId) => {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) return;

    const newRole = currentUser.role === "admin" ? "user" : "admin";

    try {
      const updatedUser = await userService.updateUserRole(userId, newRole);
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? { ...user, role: updatedUser.role } : user))
      );
      toast.info(`Changed ${currentUser.name}'s system role to ${newRole}`);
    } catch (err) {
      toast.error(err.message || "Failed to update role.");
    }
  };

  const deleteUser = async (userId) => {
    if (confirm("Are you sure you want to remove this user?")) {
      try {
        await userService.deleteUser(userId);
        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err.message || "Failed to delete user.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-error/10 rounded-xl mt-1">
            <ShieldAlert className="w-8 h-8 text-error" />
          </div>
          <div>
            <h1 className="text-3xl font-manrope font-bold text-on-surface">Admin Console</h1>
            <p className="text-on-surface-variant">Manage workspace users, roles, and global permissions.</p>
          </div>
        </div>
        <Button onClick={() => setAddUserModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 text-sm">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b ghost-border bg-surface-container-low/50">
                  <th className="p-4 font-medium text-on-surface-variant">User</th>
                  <th className="p-4 font-medium text-on-surface-variant text-center">System Role</th>
                  <th className="p-4 font-medium text-on-surface-variant text-center">Default File Access</th>
                  <th className="p-4 font-medium text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading users...
                      </span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                  <tr key={u.id} className="border-b ghost-border hover:bg-surface-variant/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full bg-surface-container" />
                        <div>
                          <p className="font-medium text-on-surface">{u.name}</p>
                          <p className="text-xs text-on-surface-variant">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={u.role === 'admin' ? 'primary' : 'default'} className="uppercase">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 flex justify-center">
                      <div className="w-40 pt-1">
                        <Select
                          value={u.defaultAccessLevel || (u.role === 'admin' ? 'Admin-level' : 'Read-level')}
                          onChange={(val) => updateAccessLevel(u.id, val)}
                          options={[
                            { value: 'View-level', label: 'View-level' },
                            { value: 'Read-level', label: 'Read-level' },
                            { value: 'Write-level', label: 'Write-level' },
                            { value: 'Admin-level', label: 'Admin-level' }
                          ]}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleRole(u.id)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded-md transition-colors"
                          title="Toggle System Role"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteUser(u.id)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors"
                          title="Remove User"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isAddUserModalOpen} onClose={() => setAddUserModalOpen(false)} title="Invite New User">
        <form onSubmit={handleAddUser} className="space-y-4">
           <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface flex items-center gap-2">Full Name</label>
            <Input type="text" name="name" required placeholder="John Doe" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</label>
             <Input type="email" name="email" required placeholder="john@company.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Temporary Password</label>
            <Input type="password" name="password" required minLength={6} placeholder="At least 6 characters" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">System Role</label>
              <select name="role" className="flex h-10 w-full rounded-lg bg-surface-container-lowest border ghost-border px-4 py-2 text-sm text-on-surface focus-visible:outline-none focus:ring-1 focus:ring-primary">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Initial File Access</label>
              <select name="accessLevel" className="flex h-10 w-full rounded-lg bg-surface-container-lowest border ghost-border px-4 py-2 text-sm text-on-surface focus-visible:outline-none focus:ring-1 focus:ring-primary">
                <option value="View-level">View-level</option>
                <option value="Read-level">Read-level</option>
                <option value="Write-level">Write-level</option>
                <option value="Admin-level">Admin-level</option>
              </select>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

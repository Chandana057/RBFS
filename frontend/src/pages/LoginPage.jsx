import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useForm } from "react-form-hook"; // Wait it's react-hook-form, I'll fix this
import { useForm as useHookForm } from "react-hook-form";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const LoginPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useHookForm();
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back to ShareVault!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to login. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl shadow-ambient border-0 ring-1 ring-white/10">
      <CardHeader className="text-center pb-8 pt-10">
        <CardTitle className="text-2xl mb-2">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access the vault.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <Input
              type="email"
              placeholder="admin@sharevault.com"
              {...register("email", { required: "Email is required" })}
              className={errors.email ? "ring-1 ring-error" : ""}
            />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className={errors.password ? "ring-1 ring-error" : ""}
            />
            {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12 mt-6 text-base" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </Button>

          {/* Quick Mock Login Helper */}
          <div className="mt-6 p-4 rounded-lg bg-surface-container-low border ghost-border">
            <p className="text-xs text-on-surface-variant mb-2 font-medium uppercase tracking-wider">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setValue("email", "admin@sharevault.com", { shouldValidate: true, shouldDirty: true });
                  setValue("password", "password123", { shouldValidate: true, shouldDirty: true });
                }}
                className="p-2 rounded bg-surface hover:bg-surface-variant transition-colors text-left"
              >
                <strong className="block text-primary">Admin</strong>
                admin@sharevault.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("email", "user@sharevault.com", { shouldValidate: true, shouldDirty: true });
                  setValue("password", "password123", { shouldValidate: true, shouldDirty: true });
                }}
                className="p-2 rounded bg-surface hover:bg-surface-variant transition-colors text-left"
              >
                <strong className="block text-secondary">User</strong>
                user@sharevault.com
              </button>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pb-8 pt-4">
        <p className="text-sm text-on-surface-variant">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Create one</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

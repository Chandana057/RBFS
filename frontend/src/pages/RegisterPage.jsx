import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Lock, Mail, User, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Watch password to validate confirm password
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data.name, data.email, data.password);
      toast.success(result.message || "Account created successfully!");
      navigate(result.token ? "/dashboard" : "/login");
    } catch (err) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl shadow-ambient border-0 ring-1 ring-white/10">
      <CardHeader className="text-center pb-8 pt-10">
        <CardTitle className="text-2xl mb-2">Create Account</CardTitle>
        <CardDescription>Join the most secure file sharing platform.</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <Input 
              type="text" 
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "ring-1 ring-error" : ""}
            />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <Input 
              type="email" 
              placeholder="name@company.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={errors.email ? "ring-1 ring-error" : ""}
            />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <Input 
              type="password" 
              placeholder="••••••••"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              className={errors.password ? "ring-1 ring-error" : ""}
            />
            {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <Lock className="w-4 h-4" /> Confirm Password
            </label>
            <Input 
              type="password" 
              placeholder="••••••••"
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              className={errors.confirmPassword ? "ring-1 ring-error" : ""}
            />
            {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12 mt-6 text-base" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center pb-8 pt-4">
        <p className="text-sm text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

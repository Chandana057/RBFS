import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await authService.resetPassword(token, data.password);
      toast.success(result?.message || "Password updated successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl shadow-ambient border-0 ring-1 ring-white/10">
      <CardHeader className="text-center pb-8 pt-10">
        <CardTitle className="text-2xl mb-2">Set New Password</CardTitle>
        <CardDescription>
          {token ? "Enter your new password below." : "Recovery link is missing or invalid."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {token ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <Lock className="w-4 h-4" /> New Password
              </label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
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
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className={errors.confirmPassword ? "ring-1 ring-error" : ""}
              />
              {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 mt-6 text-base" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 text-sm text-on-surface-variant">
            Please request a new recovery link from the forgot password page.
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pb-8 pt-4 border-t ghost-border">
        <Link to="/login" className="flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to log in
        </Link>
      </CardFooter>
    </Card>
  );
};

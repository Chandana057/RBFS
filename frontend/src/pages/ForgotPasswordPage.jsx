import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { useToast } from "../context/ToastContext";
import { authService } from "../services/authService";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      setResetLink(result?.resetLink || "");
      setIsSubmitted(true);
      toast.success(result?.message || "Recovery email sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send recovery email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl shadow-ambient border-0 ring-1 ring-white/10">
      <CardHeader className="text-center pb-8 pt-10">
        <CardTitle className="text-2xl mb-2">Reset Password</CardTitle>
        <CardDescription>
          {isSubmitted 
            ? "Check your inbox for the recovery instructions."
            : "Enter your email address to receive a recovery link."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-sm text-on-surface-variant">
              We've sent an email to <span className="font-medium text-on-surface">{email}</span> with a link to reset your password.
            </p>
            {resetLink && (
              <div className="w-full rounded-xl border ghost-border bg-surface-container-low p-4 text-left">
                <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-2">Recovery Link</p>
                <a
                  href={resetLink}
                  className="text-sm text-primary break-all hover:underline inline-flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  {resetLink}
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <Input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 mt-6 text-base" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Recovery Link"}
            </Button>
          </form>
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

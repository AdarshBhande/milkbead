"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ArrowRight, Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

type View = "login" | "forgot" | "forgot-success";

// ── Stable animated background wrapper (must be OUTSIDE the form component) ──
function BG({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FDE8F2 0%, #F8C8DC 35%, #EFD9FF 70%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}
    >
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 6s ease-in-out infinite", animationDelay: "1s" }} />
      {["🌸", "✨", "💖", "🎀"].map((e, i) => (
        <div key={i} className="absolute hidden md:block text-3xl pointer-events-none"
          style={{ top: `${10 + i * 22}%`, left: i % 2 === 0 ? "4%" : undefined, right: i % 2 !== 0 ? "4%" : undefined, animation: `float ${3 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>{e}</div>
      ))}
      {children}
    </div>
  );
}

function LoginForm() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back! 💖");
      router.push(redirect);
    } catch (err: any) {
      // Firebase error codes → friendly messages
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Incorrect email or password 🔐");
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Try again later.");
      } else {
        toast.error(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome! 🌸");
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ────────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { auth } = await import("@/lib/firebase");
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, resetEmail);
      setView("forgot-success");
    } catch (err: any) {
      const code = err.code || "";
      if (code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else {
        toast.error(err.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── View: Forgot success ───────────────────────────────────────────────────
  if (view === "forgot-success") {
    return (
      <BG>
        <div className="w-full max-w-md animate-zoom-in">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5" style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <CheckCircle2 size={38} className="text-green-500" />
            </div>
            <h1 className="font-nunito font-900 text-2xl text-softblack mb-2 animate-fade-up">Email Sent! 📧</h1>
            <p className="font-inter text-sm text-gray-400 mb-2 animate-fade-up delay-100">
              We've sent a password reset link to:
            </p>
            <p className="font-nunito font-700 text-softblack mb-6 animate-fade-up delay-200">{resetEmail}</p>
            <p className="font-inter text-xs text-gray-300 mb-6">Check your inbox (and spam folder) for the reset link. It expires in 1 hour.</p>
            <button
              onClick={() => { setView("login"); setResetEmail(""); }}
              className="flex items-center gap-2 mx-auto font-nunito font-700 text-pink-dark hover:underline text-sm"
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </div>
        </div>
      </BG>
    );
  }

  // ── View: Forgot Password form ─────────────────────────────────────────────
  if (view === "forgot") {
    return (
      <BG>
        <div className="w-full max-w-md animate-zoom-in">
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center mx-auto mb-4 shadow-lavender animate-ripple">
                <Mail size={26} className="text-purple-500" />
              </div>
              <h1 className="font-nunito font-900 text-2xl text-softblack animate-fade-up">Forgot Password?</h1>
              <p className="font-inter text-sm text-gray-400 mt-1 animate-fade-up delay-100">
                No worries! Enter your email and we'll send you a reset link 🌸
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Email Address</label>
                <input
                  id="reset-email-input"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              <button
                id="reset-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:shadow-soft-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 animate-ripple"
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Sending...</>
                  : <><Mail size={18} /> Send Reset Link</>}
              </button>
            </form>

            <button
              onClick={() => setView("login")}
              className="flex items-center gap-2 mx-auto mt-6 font-nunito font-700 text-sm text-gray-400 hover:text-pink-dark transition-colors duration-200"
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </div>
        </div>
      </BG>
    );
  }

  // ── View: Login form ───────────────────────────────────────────────────────
  return (
    <BG>
      <div className="w-full max-w-md animate-zoom-in">
        <div className="card p-8 hover:shadow-soft-lg transition-shadow duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-milkpink flex items-center justify-center mx-auto mb-4 shadow-soft-glow animate-ripple">
              <span className="text-3xl" style={{ animation: "bounceSoft 2s ease-in-out infinite" }}>🌸</span>
            </div>
            <h1 className="font-nunito font-900 text-2xl text-softblack animate-fade-up">Welcome back!</h1>
            <p className="font-inter text-sm text-gray-400 mt-1 animate-fade-up delay-100">Sign in to your Milkbead account</p>
          </div>

          {/* Google */}
          <button
            id="google-login-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-pink-light bg-white hover:bg-pink-light py-3 rounded-2xl font-nunito font-700 text-softblack text-sm transition-all duration-200 hover:scale-105 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-pink-100" />
            <span className="font-inter text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-pink-100" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Email</label>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-nunito font-700 text-sm text-softblack">Password</label>
                {/* ── Forgot Password link ── */}
                <button
                  type="button"
                  onClick={() => { setView("forgot"); setResetEmail(email); }}
                  className="font-inter text-xs text-pink-dark hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-softblack"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:shadow-soft-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 animate-ripple"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center font-inter text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-pink-dark font-nunito font-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </BG>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-milkpink" size={32} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

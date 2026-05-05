"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      toast.success("Welcome to Milkbead! 🌸💖");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome! 🌸");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EFD9FF 0%, #F8C8DC 35%, #FDE8F2 70%, #F5E6D3 100%)", backgroundSize: "400% 400%", animation: "gradientShift 8s ease infinite" }}
    >
      {/* Blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #E6D6FF, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F8C8DC, transparent 70%)", animation: "float 6s ease-in-out infinite", animationDelay: "1s" }} />

      {/* Floating emoji */}
      {["✨", "🌸", "💖", "🎀"].map((e, i) => (
        <div key={i} className="absolute hidden md:block text-3xl pointer-events-none"
          style={{ top: `${10 + i * 22}%`, left: i % 2 === 0 ? "4%" : undefined, right: i % 2 !== 0 ? "4%" : undefined, animation: `float ${3 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>{e}</div>
      ))}

      <div className="w-full max-w-md animate-zoom-in">
        <div className="card p-8 hover:shadow-soft-lg transition-shadow duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center mx-auto mb-4 shadow-lavender animate-ripple">
              <span className="text-3xl" style={{ animation: "bounceSoft 2s ease-in-out infinite" }}>✨</span>
            </div>
            <h1 className="font-nunito font-900 text-2xl text-softblack animate-fade-up">Join Milkbead!</h1>
            <p className="font-inter text-sm text-gray-400 mt-1 animate-fade-up delay-100">Create your account and start shopping 💖</p>
          </div>

          <button
            id="google-register-btn"
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Full Name</label>
              <input id="register-name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-field" required />
            </div>
            <div>
              <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Email</label>
              <input id="register-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field" required />
            </div>
            <div>
              <label className="block font-nunito font-700 text-sm text-softblack mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="register-password-input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-field pr-12"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-softblack">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-milkpink text-softblack font-nunito font-700 py-4 rounded-2xl hover:bg-pink-dark hover:text-white hover:shadow-soft-glow hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 animate-ripple"
            >
              {loading ? "Creating account..." : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center font-inter text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-pink-dark font-nunito font-700 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

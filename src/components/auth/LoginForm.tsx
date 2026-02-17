"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const login = useStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setHasError(false);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(email, password, rememberMe);

    if (success) {
      router.push("/board");
    } else {
      setError("Invalid email or password");
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px] gap-10 items-center">
          <div className="flex flex-col items-start space-y-6">
            <div className="bg-black w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
              <h1 className="text-xs md:text-sm font-bold text-white tracking-wider">
                HINTRO
              </h1>
            </div>

            <img
              src="/images/login-image.png"
              alt="Task Board Illustration"
              className="
                hidden md:block
                w-full
                max-w-xl
                lg:max-w-none
                h-auto
                max-h-[320px]
                lg:max-h-[420px]
                object-cover
                select-none
              "
              loading="eager"
            />
          </div>

          <div className="w-full">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                LOGIN
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
                Please fill your detail to access your account.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                      hasError
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-black focus:border-black"
                    }`}
                    placeholder="intern@demo.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition pr-10 ${
                        hasError
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-black focus:border-black"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none rounded hover:bg-gray-100"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus:ring-offset-0 cursor-pointer"
                      style={{ accentColor: "#000000" }}
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black transition text-left"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-2.5 sm:py-3.5 px-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm sm:text-base"
                >
                  {isLoading ? "Signing in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  Demo credentials
                </p>
                <p className="font-mono bg-gray-100 px-2 sm:px-3 py-2 sm:py-2.5 rounded mt-2 text-xs sm:text-sm overflow-auto">
                  intern@demo.com / intern123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

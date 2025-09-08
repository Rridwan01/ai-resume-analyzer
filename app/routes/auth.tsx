import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Login into your account" },
];

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const searchParams = new URLSearchParams(location.search);
      const next = searchParams.get("next") || "/";
      navigate(next, { replace: true });
    }
  }, [auth.isAuthenticated, location.search, navigate]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center min-h-screen">
      <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1>Welcome</h1>
          <h2>Log In to Continue Your Job Journey</h2>
        </div>
        <div>
          {isLoading ? (
            <button className="auth-button animate-pulse">
              <p>Signing you in...</p>
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button className="auth-button" onClick={auth.signOut}>
                  <p>Log Out</p>
                </button>
              ) : (
                <button className="auth-button" onClick={auth.signIn}>
                  <p>Log In</p>
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

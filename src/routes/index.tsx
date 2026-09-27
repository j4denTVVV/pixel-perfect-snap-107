import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/hub/common";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "J4denTV Creator Hub — Sign in" },
      {
        name: "description",
        content:
          "Private creator dashboard for J4denTV: plan videos and streams, store ideas, track analytics and goals.",
      },
      { property: "og:title", content: "J4denTV Creator Hub" },
      {
        property: "og:description",
        content: "Private planning and analytics dashboard for J4denTV content.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { data, error } = await action;
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data.session) return toast.success("Check your email to confirm the account.");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel w-full max-w-sm p-8">
        <p className="section-title text-2xl">J4denTV</p>
        <p className="text-sm text-muted-foreground">Creator Hub</p>
        <p className="mt-6 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to your private dashboard." : "Create your account."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "First time? Create your account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

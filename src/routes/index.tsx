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

const OWNER_EMAIL = "owner.j4dentv@gmail.com";

function SignIn() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: OWNER_EMAIL, password });
    setBusy(false);
    if (error) { toast.error("Incorrect password"); return; }
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel w-full max-w-sm p-8 text-center">
        <p className="section-title text-2xl">J4denTV</p>
        <p className="text-sm text-muted-foreground">Creator Hub</p>
        <p className="mt-6 text-sm text-muted-foreground">Private access</p>
        <form onSubmit={submit} className="mt-6 space-y-4 text-left">
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
            />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}

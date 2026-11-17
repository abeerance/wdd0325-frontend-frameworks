import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

// page.tsx is the page for the route /login. It is a Server Component (it renders on the server
// and sends plain HTML). The form inside it is the only part that needs the browser.
export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      {/* Page title: the small label and the h1 tell the visitor where they are. */}
      <header className="flex flex-col gap-2">
        <p className="font-medium text-moss text-sm uppercase tracking-widest">
          Members
        </p>
        <h1 className="font-semibold text-4xl text-ink sm:text-5xl">Sign in</h1>
        <Text>
          Sign in to borrow a packet and to see the ones you have out.
        </Text>
      </header>

      {/* The form itself lives in LoginForm, which is a Client Component because it handles input. */}
      <Card>
        <LoginForm />
      </Card>

      {/* A way out for people who have no account yet. */}
      <Text className="text-bark text-sm">
        Don't have an account yet?
        <Link
          href="/join"
          className="inline-flex min-h-11 items-center rounded-sm font-medium text-moss underline underline-offset-4 hover:text-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
        >
          Join now
        </Link>
      </Text>
    </div>
  );
}

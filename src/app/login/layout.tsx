import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Formvive.",
  description: "Welcome back to Formvive.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

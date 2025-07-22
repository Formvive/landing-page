import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Get started with Formvive.",
  description: "Get started with Formvive.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

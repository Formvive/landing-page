import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Formvive.",
  description: "Settle in to Formvive.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

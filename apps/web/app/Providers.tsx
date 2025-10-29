"use client";

import TrpcProvider from "@repo/trpc/TrpcProvider";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function TrpcWithAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  return (
    <TrpcProvider url={process.env.NEXT_PUBLIC_TRPC_URL!} token={token}>
      {children}
    </TrpcProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TrpcWithAuth>{children}</TrpcWithAuth>
    </AuthProvider>
  );
}

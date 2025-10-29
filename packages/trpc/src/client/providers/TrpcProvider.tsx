"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { createTrpcClient, queryClient, trpc } from "../client";

interface TrpcProviderProps extends PropsWithChildren {
  url: string;
  token?: string | null;
}

export default function TrpcProvider({ children, url, token }: TrpcProviderProps) {
  // Recreate client when token changes
  const client = useMemo(() => {
    return createTrpcClient(url, () => token || null);
  }, [url, token]);

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

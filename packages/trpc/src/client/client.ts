import { AppRouter } from "@repo/trpc/router";
import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCReact,
  CreateTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";

export const trpc: CreateTRPCReact<AppRouter, object> = createTRPCReact<
  AppRouter,
  object
>();

export const queryClient = new QueryClient();

export const createTrpcClient = (
  url: string,
  getToken?: () => string | null
) => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url,
        headers() {
          const token = getToken?.();
          return token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {};
        },
        fetch(url, options) {
          return fetch(url, {
            ...(options as RequestInit),
            credentials: "include",
          });
        },
      }),
    ],
  });
};

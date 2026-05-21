"use client";

import { Toast } from "@heroui/react";
import QueryProvider from "./query-provider";
// import { AuthProvider } from './auth-provider'; // Futuro provider de Auth

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    /* 1. TanStack Query debe envolver a casi todo para que la data esté disponible */
    <QueryProvider>
      <Toast.Provider placement="top" />
      {/* 3. Aquí irían otros como ThemeProvider o AuthProvider */}
      {children}
    </QueryProvider>
  );
}

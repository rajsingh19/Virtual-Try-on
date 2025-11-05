// app/(main)/layout.tsx
"use client";

import Footer from "@/components/footer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

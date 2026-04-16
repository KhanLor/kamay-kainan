"use client";

import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff8ec",
            color: "#4f2d17",
            border: "1px solid #e8b37a",
          },
        }}
      />
    </>
  );
}

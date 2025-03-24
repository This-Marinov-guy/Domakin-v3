"use client";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterFour from "@/layouts/footers/FooterFour";

// Custom fallback component
const ErrorFallback = ({ resetErrorBoundary }: any) => {
  const router = useRouter();
  const { t } = useTranslation("translations");

  return (
    <div
      style={{ marginTop: "20vh" }}
      className="flex flex-col items-center justify-center text-center"
    >
      <h4 className="font-semibold mb-4">
        {t("react_error.something_went_wrong")}
      </h4>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <button onClick={resetErrorBoundary} className="btn-fourteen">
          {t("react_error.try_again")}
        </button>
        <button onClick={() => router.push("/")} className="btn-fourteen">
          {t("react_error.go_home")}
        </button>
      </div>
    </div>
  );
};

const ErrorLayout = ({ children }: any) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        key={router.asPath} // Force remount on route change
      >
        <HeaderOne />
        <main className="flex-1 flex flex-col items-center justify-center">
          {children}
        </main>
        <FooterFour />
      </ErrorBoundary>
    </div>
  );
};

export default ErrorLayout;

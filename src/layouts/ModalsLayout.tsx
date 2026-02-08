'use client'

import React from "react";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/modals/AuthModal"), {
  ssr: false,
});

import CookiesModal from "@/components/ui/modals/CookiesModal";
import LongLoadingModal from "@/components/ui/modals/LongLoadingModal";
import PaymentLinkModal from "@/components/ui/modals/PaymentLinkModal";
import ApplicationsModal from "@/components/ui/modals/ApplicationsModal";

function ModalsLayout() {
  return (
    <>
      <CookiesModal />
      <AuthModal/>
      <LongLoadingModal/>
      <PaymentLinkModal />
      <ApplicationsModal />
    </>
  );
}

export default ModalsLayout;

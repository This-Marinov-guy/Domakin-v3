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
import PotentialSearchersModal from "@/components/ui/modals/PotentialSearchersModal";
import ApplicationPreviewModal from "@/components/ui/modals/ApplicationPreviewModal";
import PromoteUsersModal from "@/components/ui/modals/PromoteUsersModal";
import ReferralBonusEditModal from "@/components/ui/modals/ReferralBonusEditModal";
import AgentEditModal, { AgentPreviewModal } from "@/components/ui/modals/AgentEditModal";

function ModalsLayout() {
  return (
    <>
      <CookiesModal />
      <AuthModal/>
      <LongLoadingModal/>
      <PaymentLinkModal />
      <ApplicationsModal />
      <PotentialSearchersModal />
      <ApplicationPreviewModal />
      <PromoteUsersModal />
      <ReferralBonusEditModal />
      <AgentEditModal />
      <AgentPreviewModal />
    </>
  );
}

export default ModalsLayout;

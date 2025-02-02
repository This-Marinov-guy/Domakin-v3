import React from "react";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/modals/AuthModal"), {
  ssr: false,
});
import CookiesModal from "@/components/ui/modals/CookiesModal";

function ModalsLayout() {
  return (
    <>
      <CookiesModal />
      <AuthModal/>
    </>
  );
}

export default ModalsLayout;

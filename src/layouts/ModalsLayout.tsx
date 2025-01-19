import React from "react";
import CookiesModal from "@/components/ui/modals/CookiesModal";
import AuthModal from "@/modals/AuthModal";

function ModalsLayout() {
  return (
    <>
      <CookiesModal />
      <AuthModal/>
    </>
  );
}

export default ModalsLayout;

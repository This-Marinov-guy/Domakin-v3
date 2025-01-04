import React from "react";
import CookiesModal from "@/components/ui/modals/CookiesModal";
import LoginModal from "@/modals/LoginModal";

function ModalsLayout() {
  return (
    <>
      <CookiesModal />
      <LoginModal/>
    </>
  );
}

export default ModalsLayout;

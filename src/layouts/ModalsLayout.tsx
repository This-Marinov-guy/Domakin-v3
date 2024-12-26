import React from "react";
import CookiesModal from "@/components/ui/modals/CookiesModal";
import LoginModal from "@/modals/LoginModal";
import { observer } from "mobx-react-lite";

function ModalsLayout() {
  return (
    <>
      <CookiesModal />
      <LoginModal/>
    </>
  );
}

export default observer(ModalsLayout);

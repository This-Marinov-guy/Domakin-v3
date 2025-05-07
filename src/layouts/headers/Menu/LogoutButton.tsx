import React from "react";
import Link from "next/link";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Image from "next/image";
import logout_icon from "@/assets/images/dashboard/icon/icon_41.svg";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";

const LogoutButton = ({ withText = false }) => {
  const { t } = useTranslation("translations");
  const {
    userStore: { logout },
  } = useStore();

  return (
    <Link
      href="/"
      onClick={logout}
      className="d-flex align-items-center logout-btn"
    >
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>{t("header.logout")}</Tooltip>}
      >
        <div className="icon tran3s d-flex align-items-center justify-content-center rounded-circle">
          <Image src={logout_icon} alt="" />
        </div>
      </OverlayTrigger>
      {withText && <span>{t("header.logout")}</span>}
    </Link>
  );
};

export default LogoutButton;
